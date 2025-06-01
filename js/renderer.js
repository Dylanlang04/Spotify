async function loadUsers() {
  const response = await fetch('http://localhost:3000/users');
  const users = await response.json();
  console.log(users);
}

