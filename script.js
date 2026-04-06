document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form submission with real API calls
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-primary');
            const originalText = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            btn.style.opacity = '0.8';
            btn.style.pointerEvents = 'none';

            try {
                let response, data;

                if (form.id === 'registerForm') {
                    const fullname = document.getElementById('fullname').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    const confirm_password = document.getElementById('confirm_password').value;

                    if (password !== confirm_password) {
                        throw new Error("Passwords do not match.");
                    }

                    response = await fetch('http://localhost:3000/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullname, email, password })
                    });
                } else if (form.id === 'loginForm') {
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;

                    response = await fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                }

                data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Something went wrong');
                }

                // Success State!
                btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + (data.message || 'Success!');
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    if (form.id === 'registerForm') {
                        // Automatically "Log In" the user in the background
                        localStorage.setItem('currentUser', JSON.stringify(data.user));
                        window.location.href = 'dashboard.html';
                    } else {
                        // After login, save user session and enter application
                        localStorage.setItem('currentUser', JSON.stringify(data.user));
                        window.location.href = 'dashboard.html';
                    }
                }, 1500);

            } catch (err) {
                // Error State
                btn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Error';
                btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
                alert(err.message);
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    });
});
