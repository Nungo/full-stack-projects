<template>
  <div class="register-container">
    <div class="register-form">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required />

        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>

        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>

        <button type="submit" class="btn-primary">Register</button>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      successMessage: '',
      emailError: '',
      passwordError: '',
    };
  },
  methods: {
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validatePassword(password) {
      const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return complexityRegex.test(password);
    },
    async handleRegister() {
      // Email validation
      if (!this.validateEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.';
        return;
      } else {
        this.emailError = ''; // Clear error message
      }

      // Password validation
      if (!this.validatePassword(this.password)) {
        this.passwordError = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';
        return;
      } else {
        this.passwordError = ''; // Clear error message
      }

      // Make API call
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        console.log('Register response:', data);

        if (response.ok) {
          this.successMessage = data.message;

          // Redirect to login page after success
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.emailError = data.message || 'Registration failed. Please try again.';
        }
      } catch (error) {
        console.error('Register error:', error); // Debugging line
        this.emailError = 'An error occurred. Please try again later.';
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-form {
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




  