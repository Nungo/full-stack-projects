<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <label for="usernameOrEmail">Username or Email:</label>
        <input type="text" v-model="usernameOrEmail" id="usernameOrEmail" required />

        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />

        <button type="submit" class="btn-primary">Login</button>

        <!-- Success or Error Message -->
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usernameOrEmail: this.usernameOrEmail,
            password: this.password,
          }),
        });

        const data = await response.json();

        console.log('Login response:', data); // Debugging line

        if (response.ok) {
          this.successMessage = data.message;
          this.errorMessage = '';
          localStorage.setItem('user', this.usernameOrEmail);

          // Redirect to dashboard after success
          setTimeout(() => {
            this.$router.push('/dashboard');
          }, 2000);
        } else {
          this.errorMessage = data.message || 'Login failed. Please try again.';
          this.successMessage = '';
        }
      } catch (error) {
        console.error('Login error:', error); // Debugging line
        this.errorMessage = 'An error occurred. Please try again later.';
        this.successMessage = '';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  background: rgba(255, 255, 255, 0.8);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-primary {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.success-message {
  color: green;
  margin-top: 10px;
  font-weight: bold;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>












