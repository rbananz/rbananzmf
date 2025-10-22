

const loginBtn = document.getElementById('login-btn');
const avatar = document.getElementById('avatar');

loginBtn.addEventListener('click', () => {
  window.location.href = '/login';
});

const contactBtn = document.getElementById('contact-btn');
contactBtn.addEventListener('click', async () => {
  const message = prompt('Enter your commission request:');
  if (!message) return;

  const res = await fetch('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (res.ok) alert('✅ Sent to Discord!');
  else alert('❌ Failed to send.');
});

fetch('/user').then(res => res.json()).then(data => {
  if (data && data.avatar) {
    avatar.src = data.avatar;
    avatar.style.display = 'inline';
    loginBtn.style.display = 'none';
  }
});
