
import { 
  DataPoint, ResolutionContext, ResolvedData, 
  ConflictResolutionMethod, ConflictResolutionRule, BusinessContext
} from '../../types';
import { ShardingService } from '../blockchainService';
// 🛠️ Fixed: Changed import casing to match superdictionary.ts
// Changed SUPER_DICTIONARY to superdictionary
import { superdictionary } from '../../superdictionary';
import { NotifyBus } from '../notificationService';
import { PersonaID } from '../../types';
import { ContextScoring } from '../scoring/ContextScoringEngine';

export class ConflictResolver {
  private static instance: ConflictResolver;

  public static getInstance(): ConflictResolver {
    if (!ConflictResolver.instance) {
      ConflictResolver.instance = new ConflictResolver();
    }
    return ConflictResolver.instance;
  }

  /**
   * Giải quyết xung đột giữa các DataPoints sử dụng Context-Aware Scoring
   */
  public async resolveConflicts(
    dataPoints: DataPoint[],
    context: ResolutionContext
  ): Promise<ResolvedData> {
    
    if (dataPoints.length === 0) throw new Error("No data points to resolve");
    if (dataPoints.length === 1) {
      return {
        winner: dataPoints[0],
        losers: [],
        methodUsed: ConflictResolutionMethod.PRIORITY_BASED,
        resolutionHash: ShardingService.generateShardHash(dataPoints[0]),
        isAutoResolved: true
      };
    }

    // 1. Xác định ngữ cảnh doanh nghiệp để chấm điểm
    const businessContext: BusinessContext = {
       industry: this.mapDomainToIndustry(context.businessType),
       region: 'VN',
       priority: 'NORMAL',
       dataType: context.businessType
    };

    // 2. Chấm điểm từng Data Point qua Engine
    const scoredPoints = await Promise.all(dataPoints.map(async (p) => {
        const scoreResult = await ContextScoring.scoreDataContext(p, businessContext);
        return {
            ...p,
            calculatedConfidence: scoreResult.finalScore,
            scoreDetails: scoreResult.details // Optional: Attach for debugging
        };
    }));

    // 3. Tải quy tắc giải quyết xung đột
    const rule = this.loadConflictRule(context.businessType);

    // 4. Sắp xếp theo điểm số mới (Context Score)
    scoredPoints.sort((a, b) => (b.calculatedConfidence || 0) - (a.calculatedConfidence || 0));

    const winner = scoredPoints[0];
    const secondPlace = scoredPoints[1];
    const confidenceGap = (winner.calculatedConfidence || 0) - (secondPlace.calculatedConfidence || 0);

    // 5. Quyết định giải quyết
    let isAutoResolved = false;
    let methodUsed = rule.defaultMethod;

    // Nếu khoảng cách điểm đủ lớn -> Tự động chọn
    if (confidenceGap >= rule.threshold) {
        isAutoResolved = true;
    } else if (rule.fallbackMethod === ConflictResolutionMethod.TIMESTAMP_BASED) {
        // Nếu điểm ngang nhau, dùng Timestamp (người mới thắng)
        scoredPoints.sort((a, b) => b.timestamp - a.timestamp);
        isAutoResolved = true;
        methodUsed = ConflictResolutionMethod.TIMESTAMP_BASED;
    } else {
        // Không đủ ngưỡng tin cậy -> Chuyển manual
        methodUsed = ConflictResolutionMethod.MANUAL_REVIEW;
        isAutoResolved = false;
        
        NotifyBus.push({
          type: 'RISK',
          title: 'CONFLICT ALERT (Context-Aware)',
          content: `Xung đột tại ${context.businessType}. Gap: ${(confidenceGap * 100).toFixed(1)}%. Winner Score: ${winner.calculatedConfidence}`,
          persona: PersonaID.KRIS,
          priority: 'HIGH'
        });
    }

    return {
      winner: scoredPoints[0],
      losers: scoredPoints.slice(1),
      methodUsed,
      resolutionHash: ShardingService.generateShardHash({ winner: scoredPoints[0].id, context }),
      isAutoResolved
    };
  }

  private mapDomainToIndustry(domain: string): BusinessContext['industry'] {
      if (domain === 'JEWELRY' || domain === 'PRODUCTION') return 'JEWELRY';
      if (domain === 'FINANCE' || domain === 'TAX' || domain === 'SALES_TAX') return 'FINANCE';
      if (domain === 'LOGISTICS' || domain === 'WAREHOUSE') return 'LOGISTICS';
      return 'GENERAL';
  }

  private loadConflictRule(businessType: string): ConflictResolutionRule {
    // FIX: Usage of superdictionary (lowercase)
    const rulesDict = (superdictionary as any).conflict_resolution_rules;
    const rule = rulesDict[businessType];

    if (!rule) {
      return {
        dataType: 'GENERIC',
        threshold: 0.15,
        defaultMethod: ConflictResolutionMethod.PRIORITY_BASED,
        fallbackMethod: ConflictResolutionMethod.MANUAL_REVIEW
      };
    }

    return {
        dataType: rule.dataType,
        threshold: rule.threshold,
        defaultMethod: rule.defaultMethod as ConflictResolutionMethod,
        fallbackMethod: rule.fallbackMethod as ConflictResolutionMethod
    };
  }
}

export const ConflictEngine = ConflictResolver.getInstance();
