<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-app-bar-title>
        <v-icon left>mdi-vuetify</v-icon>
        Vue.js + Express Template
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" md="8" lg="6">
            <v-card elevation="8" class="mx-auto">
              <v-card-title class="text-h4 text-center primary--text">
                <v-icon left large color="primary">mdi-rocket-launch</v-icon>
                Welcome to Your New Project
              </v-card-title>
              
              <v-card-subtitle class="text-center py-4">
                A clean starting point for full-stack applications with Vuetify Material Design
              </v-card-subtitle>

              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <p class="text-body-1 text-center mb-6">
                      This is a vanilla Vue.js frontend with an Express.js backend, now enhanced with Vuetify's Material Design components.
                    </p>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <v-row>
                  <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                      <v-card-title class="text-h6">
                        <v-icon left color="success">mdi-api</v-icon>
                        Example API Integration
                      </v-card-title>
                      
                      <v-card-text>
                        <div class="text-center">
                          <v-btn 
                            @click="testApiConnection" 
                            :loading="loading" 
                            color="primary" 
                            size="large"
                            variant="elevated"
                            class="mb-4"
                          >
                            <v-icon left>mdi-connection</v-icon>
                            {{ loading ? 'Testing...' : 'Test API Connection' }}
                          </v-btn>
                        </div>
                        
                        <v-alert
                          v-if="apiResponse"
                          type="success"
                          variant="tonal"
                          class="mt-4"
                          closable
                          @click:close="apiResponse = null"
                        >
                          <v-alert-title>API Response:</v-alert-title>
                          <pre class="text-body-2 mt-2">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
                        </v-alert>
                        
                        <v-alert
                          v-if="error"
                          type="error"
                          variant="tonal"
                          class="mt-4"
                          closable
                          @click:close="error = null"
                        >
                          <v-alert-title>Error:</v-alert-title>
                          {{ error }}
                        </v-alert>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="surface-variant" class="text-center">
      <v-row no-gutters>
        <v-col class="text-center mt-4" cols="12">
          <v-chip color="primary" variant="text" size="small">
            <v-icon start>mdi-vuejs</v-icon>
            Built with Vue.js 3 + Express.js + Vuetify + Vite
          </v-chip>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useTheme } from 'vuetify';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
}

export default {
  name: 'App',
  data() {
    return {
      loading: false,
      apiResponse: null,
      error: null,
      isDark: false
    }
  },
  methods: {
    async testApiConnection() {
      this.loading = true;
      this.error = null;
      this.apiResponse = null;
      
      try {
        const response = await axios.get('/api/health');
        this.apiResponse = response.data;
      } catch (error) {
        console.error('API connection failed:', error);
        this.error = error.response?.data?.message || error.message || 'Connection failed';
      } finally {
        this.loading = false;
      }
    },
    toggleTheme() {
      this.isDark = !this.isDark;
      this.$vuetify.theme.global.name = this.isDark ? 'dark' : 'light';
    }
  },
  mounted() {
    // Set initial theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark = prefersDark;
    this.$vuetify.theme.global.name = prefersDark ? 'dark' : 'light';
  }
}
</script>

<style scoped>
/* Custom styles for JSON formatting */
pre {
  font-family: 'Roboto Mono', monospace;
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow-x: auto;
}

/* Ensure proper icon alignment */
.v-icon.v-icon--left {
  margin-right: 8px;
}

.v-icon.v-icon--start {
  margin-right: 8px;
}

/* Custom card elevation and spacing */
.v-card.mx-auto {
  max-width: 100%;
}

/* Custom responsive adjustments */
@media (max-width: 600px) {
  .v-card-title.text-h4 {
    font-size: 1.5rem !important;
  }
  
  .v-btn.v-btn--size-large {
    font-size: 0.875rem;
  }
}
</style>