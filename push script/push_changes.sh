#!/bin/bash

# إعداد المتغيرات
REPO_PATH="/home/eyad/e6ad2020.github.io"  # مسار المستودع
BRANCH="main"  # غيّرها حسب اسم الفرع لديك

# الانتقال إلى المستودع
cd "$REPO_PATH" || { echo "❌ فشل الدخول إلى المجلد"; exit 1; }

# التأكد من أن هناك تغييرات غير مرفوعة
if [[ -n $(git status --porcelain) ]]; then
    echo "📂 هناك تغييرات جديدة، جاري رفعها..."

    # إضافة جميع التغييرات
    git add .

    # إنشاء كوميت جديد
    git commit -m "Auto commit: $(date +'%Y-%m-%d %H:%M:%S')"

    # رفع التغييرات إلى الفرع الرئيسي
    git push origin "$BRANCH"

    echo "✅ تم رفع التغييرات بنجاح!"
else
    echo "✅ لا توجد تغييرات لرفعها."
fi

