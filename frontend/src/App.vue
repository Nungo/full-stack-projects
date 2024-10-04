<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import './assets/main.css';
import './assets/global.css';

const router = useRouter();
const isLoggedIn = ref(false);  // Reactive state to check if user is logged in

// Check if user is logged in based on localStorage or another method
onMounted(() => {
  const user = localStorage.getItem('user');  // Assuming user is stored in localStorage after login (testing)
  isLoggedIn.value = !!user;  // Convert to boolean (true if user exists)
});

// Method to handle exiting the website
function exitWebsite() {
  if (confirm('Are you sure you want to exit?')) {
    localStorage.removeItem('user');  // Clear stored user data
    window.location.href = 'https://www.google.com';  // Redirect to external site, to force close on website and provide that functionality
  }
}

// Method to show alert when trying to access dashboard without logging in
function showLoginAlert() {
  alert('Please log in first to access the dashboard!');
}
</script>

<template>
  <header>
    <img alt="KOTA KING" class="logo" src="@/assets/logo.jpg" width="125" height="125"/>

    <div class="wrapper">
      <nav>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <!-- Dashboard Button: Disable if not logged in -->
        <RouterLink v-if="isLoggedIn" to="/dashboard">Dashboard</RouterLink>
        <button v-else disabled @click="showLoginAlert" class="disabled-dashboard">
          Dashboard (Login Required)
        </button>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <!-- Exit Button -->
      <button @click="exitWebsite" class="exit-btn">Exit</button>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/* Disable styling for the dashboard when the user is not logged in */
button.disabled-dashboard {
  background-color: grey;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: not-allowed;
  margin-top: 1rem;
}

/* Existing styles */
button.exit-btn {
  background-color: #ff4c4c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

button.exit-btn:hover {
  background-color: #e60000;
}
</style>







