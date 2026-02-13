#!/bin/bash
# Tổng hợp tasks từ KMF 9.2.6

KMF_FILE="kmf9.2.6.json"

if [ ! -f "$KMF_FILE" ]; then
    echo "❌ Không tìm thấy $KMF_FILE"
    exit 1
fi

echo ""
echo "══════════════════════════════════════════════════════════"
echo "           TỔNG HỢP TASKS (KMF 9.2.6)"
echo "══════════════════════════════════════════════════════════"
echo ""

# 1. Immediate actions
echo "🔴 IMMEDIATE ACTIONS (theo persona)"
echo "------------------------------------"
grep -A 20 '"immediate_actions"' "$KMF_FILE" | grep -E '"[a-z_]+":' | sed 's/[",]//g' | sed 's/_/ /g' | while read line; do
    echo "🔹 $(echo $line | tr 'a-z' 'A-Z')"
done

echo ""

# 2. Các cell còn pending
echo "🟡 BUSINESS CELLS – CÔNG VIỆC CÒN LẠI"
echo "------------------------------------"
grep -A 50 '"wave3_current_state"' "$KMF_FILE" | grep -E '"(name|pending|assigned|deadline)"' | paste -d ' ' - - - - | sed 's/[",]//g' | while read name pending assigned deadline; do
    if [[ "$pending" != "pending" && -n "$pending" ]]; then
        echo "🔸 $name: $pending"
        echo "   └─ assigned: $assigned | deadline: $deadline"
    fi
done

echo ""

# 3. Strategic postponements
echo "🟢 STRATEGIC POSTPONEMENTS"
echo "--------------------------"
grep -A 10 '"strategic_postponements"' "$KMF_FILE" | grep -E '"(topic|reason|target)"' | paste -d ' ' - - - | sed 's/[",]//g' | while read topic reason target; do
    echo "• $topic: $reason – $target"
done

echo ""
echo "══════════════════════════════════════════════════════════"
