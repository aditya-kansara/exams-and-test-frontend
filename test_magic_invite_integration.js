// Test script to verify magic invite integration
// Run this in the browser console on localhost:3000

console.log('🧪 Testing Magic Invite Integration...');

// Test 1: Check if API client has magic invite methods
const testApiMethods = () => {
  console.log('✅ Testing API methods...');
  
  // These should be available in the global scope if we expose them
  // For now, we'll test the actual API calls
  fetch('http://localhost:8000/api/v1/exam/auth/magic-invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@example.com'
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Magic invite API test:', data);
  })
  .catch(error => {
    console.error('❌ Magic invite API test failed:', error);
  });
};

// Test 2: Check if AuthModal component loads
const testAuthModal = () => {
  console.log('✅ Testing AuthModal component...');
  
  // Check if the modal can be opened
  const authButton = document.querySelector('[data-testid="auth-button"]') || 
                    document.querySelector('button[class*="Sign In"]');
  
  if (authButton) {
    console.log('✅ Auth button found:', authButton);
    authButton.click();
    
    // Check if modal opens
    setTimeout(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        console.log('✅ AuthModal opened successfully');
        
        // Check for magic link button
        const magicButton = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent.includes('Magic Link')
        );
        
        if (magicButton) {
          console.log('✅ Magic Link button found');
        } else {
          console.log('❌ Magic Link button not found');
        }
      } else {
        console.log('❌ AuthModal did not open');
      }
    }, 100);
  } else {
    console.log('❌ Auth button not found');
  }
};

// Test 3: Check if magic link page exists
const testMagicLinkPage = () => {
  console.log('✅ Testing magic link page...');
  
  fetch('/auth/magic-link')
    .then(response => {
      if (response.ok) {
        console.log('✅ Magic link page accessible');
      } else {
        console.log('❌ Magic link page not accessible:', response.status);
      }
    })
    .catch(error => {
      console.log('❌ Magic link page test failed:', error);
    });
};

// Run all tests
console.log('🚀 Starting integration tests...');
testApiMethods();
testAuthModal();
testMagicLinkPage();

console.log('🎉 Magic invite integration tests completed!');
console.log('📋 Manual test checklist:');
console.log('1. Open localhost:3000');
console.log('2. Click "Sign In" button');
console.log('3. Try "Magic Link" authentication');
console.log('4. Enter email and click "Send Magic Link"');
console.log('5. Check backend logs for magic link generation');
console.log('6. Verify magic link page at /auth/magic-link');
