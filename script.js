let allUsers = []; // This will store the full list of users
let registeredUsers = []; // This will store the list of approved users

// Fetch users from the API
async function fetchUsers() {
  try {
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json(); // Parse the JSON data
    allUsers = data.users; // Save the full user list
    displayUsers(allUsers); // Display all users initially
  } catch (error) {
    console.error('Error fetching users:', error);
    document.getElementById('loading').innerHTML = 'Failed to load user applications';
  }
}

// Function to display users dynamically using array methods
function displayUsers(users) {
  // Hide the loading message once users are fetched
  document.getElementById('loading').style.display = 'none';

  const userList = document.getElementById('student-list');
  userList.innerHTML = ''; // Clear the list before adding new content

  // Use map() to create user HTML dynamically
  users.map(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('student');
    userDiv.setAttribute('data-id', user.id); // Store user ID for later use

    userDiv.innerHTML = `
      <h3>${user.firstName} ${user.lastName}</h3>
      <p class="email">${user.email}</p>
      <p class="status">${user.status || 'Pending'}</p>
      <button class="approve-button">Approve</button>
      <button class="reject-button">Reject</button>
    `;

    // Append the user div to the user list
    userList.appendChild(userDiv);

    // Add event listeners for approval and rejection
    const approveButton = userDiv.querySelector('.approve-button');
    const rejectButton = userDiv.querySelector('.reject-button');

    approveButton.addEventListener('click', () => approveUser(userDiv, user));
    rejectButton.addEventListener('click', () => rejectUser(userDiv, user));
  });
}

// Handle approving a user
function approveUser(userDiv, user) {
  const statusText = userDiv.querySelector('.status');
  statusText.innerText = 'Approved';
  statusText.style.color = 'green'; // Change status text color to green

  // Move the user to the registered users list
  registeredUsers.push(user);
  updateRegisteredList();
}

// Handle rejecting a user
function rejectUser(userDiv, user) {
  const statusText = userDiv.querySelector('.status');
  statusText.innerText = 'Rejected';
  statusText.style.color = 'red'; // Change status text color to red
}

// Update the registered students list
function updateRegisteredList() {
  const registeredList = document.getElementById('registered-list');
  registeredList.innerHTML = ''; // Clear the registered list

  registeredUsers.map(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('student');
    userDiv.innerHTML = `
      <h3>${user.firstName} ${user.lastName}</h3>
      <p class="email">${user.email}</p>
      <p class="status">Registered</p>
    `;
    registeredList.appendChild(userDiv);
  });
}

// Toggle dark and light mode
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

// Handle search/filter functionality using filter() method
function handleSearch(event) {
  const searchQuery = event.target.value.toLowerCase();
  
  // Use filter() to only show users matching the search query (name or email)
  const filteredUsers = allUsers.filter(user => 
    (`${user.firstName} ${user.lastName}`).toLowerCase().includes(searchQuery) || 
    user.email.toLowerCase().includes(searchQuery)
  );

  // Display the filtered users
  displayUsers(filteredUsers);
}

// Handle registration of a new student
function handleRegistration(event) {
  event.preventDefault(); // Prevent form from reloading the page

  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('email').value;
  const course = document.getElementById('course').value;

  // Create a new student object
  const newUser = {
    firstName,
    lastName,
    email,
    course,
    status: 'Pending'
  };

  // Add the new student to the list and display
  allUsers.push(newUser);
  displayUsers(allUsers);

  // Clear form fields
  document.getElementById('registration-form').reset();
}

// Add event listeners
document.addEventListener('DOMContentLoaded', fetchUsers);

// Event listener for the search input field
document.getElementById('search').addEventListener('input', handleSearch);

// Event listener for toggling dark/light mode
document.getElementById('toggle-theme').addEventListener('click', toggleTheme);

// Event listener for student registration form
document.getElementById('registration-form').addEventListener('submit', handleRegistration);
