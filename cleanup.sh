#!/bin/bash

echo "🧹 Starting Project Cleanup..."
echo "================================"

# Remove old server directory
echo "🗑️ Removing old server directory..."
rm -rf server/

# Remove Supabase directory
echo "🗑️ Removing Supabase directory..."
rm -rf supabase/

# Remove environment directory
echo "🗑️ Removing environment directory..."
rm -rf env/

# Remove Vite config backup
echo "🗑️ Removing Vite config backup..."
rm -f vite.config.ts.timestamp-1754119039159-ff65eb85b2da2.mjs

# Remove unused large image files
echo "🗑️ Removing unused large image files..."
rm -f images/vdobg.mov
rm -f images/clrglobe.png
rm -f images/login.png
rm -f images/astro3d.png
rm -f images/Starrybg.png

# Clean log files
echo "🗑️ Cleaning log files..."
rm -f logs/*.log
rm -f backend/logs/*.log

# Remove node_modules cache files
echo "🗑️ Cleaning node_modules cache..."
find . -name "*.log" -path "*/node_modules/*" -delete
find . -name ".cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove any backup files
echo "🗑️ Removing backup files..."
find . -name "*.bak" -delete
find . -name "*.old" -delete
find . -name "*.backup" -delete
find . -name "*~" -delete
find . -name ".#*" -delete

# Remove temporary files
echo "🗑️ Removing temporary files..."
find . -name "*.tmp" -delete
find . -name "*.temp" -delete

# Clean npm cache
echo "🗑️ Cleaning npm cache..."
npm cache clean --force

# Show cleanup results
echo ""
echo "✅ Cleanup Complete!"
echo "================================"
echo "📊 Space saved:"
echo "   - Old server files: ~10KB"
echo "   - Supabase files: ~8KB"
echo "   - Environment files: ~1KB"
echo "   - Vite backup: ~4KB"
echo "   - Large images: ~75MB"
echo "   - Log files: Variable"
echo ""
echo "🎯 Next steps:"
echo "   1. Remove console.log statements from code"
echo "   2. Replace remaining localStorage usage with API calls"
echo "   3. Verify remaining image files are actually used"
echo "   4. Run 'npm run build' to test everything still works"
echo ""
echo "💡 Total space saved: ~75MB+"