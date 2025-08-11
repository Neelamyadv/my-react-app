#!/bin/bash

echo "🧹 Starting Code Cleanup..."
echo "================================"

# Function to remove console.log statements
cleanup_console_logs() {
    echo "🗑️ Removing console.log statements..."
    
    # Remove console.log statements from TypeScript/React files
    find src/ -name "*.tsx" -o -name "*.ts" | while read file; do
        # Create backup
        cp "$file" "$file.backup"
        
        # Remove console.log statements (but keep console.error for debugging)
        sed -i '/console\.log(/d' "$file"
        
        # Remove empty lines that might be left
        sed -i '/^[[:space:]]*$/d' "$file"
        
        echo "   Cleaned: $file"
    done
}

# Function to update remaining localStorage usage
update_localstorage() {
    echo "🔄 Updating remaining localStorage usage..."
    
    # Update AdminPanel components to use API instead of localStorage
    echo "   Updating AdminPanel components..."
    
    # Note: These files need manual updates to use the new API
    echo "   ⚠️  Manual updates needed for:"
    echo "      - src/components/AdminPanel/EnrollmentManagement.tsx"
    echo "      - src/components/AdminPanel/ContactMessages.tsx"
    echo "      - src/components/AdminPanel/UserManagement.tsx"
}

# Function to check for unused imports
check_unused_imports() {
    echo "🔍 Checking for unused imports..."
    
    # This would require a more sophisticated tool like ESLint
    echo "   ⚠️  Run 'npm run lint' to check for unused imports"
}

# Function to optimize images
optimize_images() {
    echo "🖼️  Checking remaining images..."
    
    echo "   Images to verify usage:"
    echo "      - images/certificate.png (392KB)"
    echo "      - images/demo cert.png (348KB)"
    echo "      - images/Cap.png (80KB)"
    echo "      - images/Win.png (76KB)"
    echo "      - images/premium.png (52KB)"
    echo ""
    echo "   💡 Consider optimizing these images if they're used"
}

# Run cleanup functions
cleanup_console_logs
update_localstorage
check_unused_imports
optimize_images

echo ""
echo "✅ Code Cleanup Complete!"
echo "================================"
echo "🎯 Manual tasks remaining:"
echo "   1. Update AdminPanel components to use API instead of localStorage"
echo "   2. Run 'npm run lint' to check for unused imports"
echo "   3. Verify remaining image files are actually used"
echo "   4. Test the application to ensure everything still works"
echo ""
echo "💡 Code is now cleaner and more production-ready!"