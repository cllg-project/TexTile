<template>
  <v-container fluid class="py-0 px-0">
    <div class="hero-section">
      <v-container>
        <div class="d-flex align-center">
          <div class="logo-enhanced mr-6" aria-hidden="true">
            <div class="logo-inner">
              <img src="@/assets/logo_dts.png" alt="DTS Logo" class="logo-image" />
            </div>
            <div class="logo-glow"></div>
          </div>
          <div class="hero-content">
            <div class="text-white text-overline mb-2 tracking-wider">{{ $t('about.overline') }}</div>
            <h1 class="hero-title text-white mb-3">{{ $t('about.title') }}</h1>
            <div class="hero-subtitle text-white">
              {{ $t('about.description') }}
            </div>
            <div class="hero-decoration"></div>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-6">
      <!-- Enhanced Stats strip -->
      <v-row class="mb-6 stats-row" align="stretch">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="h-100 stat-card stat-card-primary" elevation="2">
            <v-card-text class="d-flex align-center pa-6">
              <div class="stat-icon-wrapper primary-gradient mr-4">
                <v-icon size="32" color="white">mdi-script-text-outline</v-icon>
              </div>
              <div>
                <div class="stat-number gradient-text-primary">2.4B+</div>
                <div class="stat-label">{{ $t('about.stats.tokens') }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="h-100 stat-card stat-card-secondary" elevation="2">
            <v-card-text class="d-flex align-center pa-6">
              <div class="stat-icon-wrapper secondary-gradient mr-4">
                <v-icon size="32" color="white">mdi-library</v-icon>
              </div>
              <div>
                <div class="stat-number gradient-text-secondary">23,467</div>
                <div class="stat-label">{{ $t('about.stats.manuscripts') }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="h-100 stat-card stat-card-teal" elevation="2">
            <v-card-text class="d-flex align-center pa-6">
              <div class="stat-icon-wrapper teal-gradient mr-4">
                <v-icon size="32" color="white">mdi-history</v-icon>
              </div>
              <div>
                <div class="stat-number gradient-text-teal">800–1600</div>
                <div class="stat-label">{{ $t('about.stats.timePeriod') }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-card class="h-100 stat-card stat-card-orange" elevation="2">
            <v-card-text class="d-flex align-center pa-6">
              <div class="stat-icon-wrapper orange-gradient mr-4">
                <v-icon size="32" color="white">mdi-translate</v-icon>
              </div>
              <div>
                <div class="stat-number gradient-text-orange">2</div>
                <div class="stat-label">{{ $t('about.stats.languages') }}</div>
                <div class="stat-sublabel">{{ $t('about.stats.languageSubtitle') }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Intro + meta -->
      <v-card class="mb-6 intro-card" elevation="3">
        <v-card-text class="pa-8">
          <div class="intro-text text-h6 text-center mb-6">
            {{ $t('about.intro.browsableCollection', { count: '23,467' }) }}
            <br><br>
            <span class="text-body-1 text-medium-emphasis">
              {{ $t('about.intro.preservation') }}
            </span>
          </div>

          <!-- <v-row class="feature-chips mb-6" justify="center">
            <v-col cols="auto">
              <v-chip 
                size="large" 
                variant="elevated" 
                color="primary" 
                prepend-icon="mdi-translate"
                class="feature-chip"
              >
                <div>
                  <div class="chip-label">Languages</div>
                  <div class="chip-value">Latin, Old French</div>
                </div>
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip 
                size="large" 
                variant="elevated" 
                color="secondary" 
                prepend-icon="mdi-timeline-clock"
                class="feature-chip"
              >
                <div>
                  <div class="chip-label">Coverage</div>
                  <div class="chip-value">c. 800–1600</div>
                </div>
              </v-chip>
            </v-col>
            <v-col cols="auto">
              <v-chip 
                size="large" 
                variant="elevated" 
                color="teal" 
                prepend-icon="mdi-file-multiple"
                class="feature-chip"
              >
                <div>
                  <div class="chip-label">Manuscripts</div>
                  <div class="chip-value">23,467</div>
                </div>
              </v-chip>
            </v-col>
          </v-row> -->

          <div class="d-flex justify-center flex-wrap action-buttons">
            <v-btn 
              color="primary" 
              variant="elevated" 
              size="large"
              class="ma-2 action-btn" 
              prepend-icon="mdi-book-open-variant"
              @click="showFull"
            >
              {{ $t('about.intro.readFull') }}
            </v-btn>
            <v-btn 
              color="secondary" 
              variant="tonal" 
              size="large"
              class="ma-2 action-btn" 
              prepend-icon="mdi-file-pdf-box"
              :href="preprintUrl" 
              target="_blank" 
              rel="noopener"
            >
              {{ $t('about.intro.preprint') }}
            </v-btn>
            <v-btn 
              variant="outlined" 
              size="large"
              class="ma-2 action-btn" 
              prepend-icon="mdi-content-copy"
              @click="copyCitation"
            >
              {{ $t('about.intro.copyCitation') }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Full about section - simplified for now -->
      <v-expand-transition>
        <v-card v-if="showFullAbout" class="mb-6 detailed-card" elevation="4">
          <v-card-text class="pa-8">
            <h2 class="text-h4 font-weight-bold gradient-text mb-4">{{ $t('about.detailed.title') }}</h2>
            <div class="text-body-1 text-medium-emphasis mb-4">
              {{ $t('about.detailed.description') }}
            </div>

            <v-alert type="warning" variant="tonal" border="start" class="mb-4">
              <div class="font-weight-medium mb-1">{{ $t('about.detailed.limitations.title') }}</div>
              <ul class="pl-4 mb-0">
                <li><strong>{{ $t('about.detailed.limitations.automatic') }}</strong></li>
                <li><strong>{{ $t('about.detailed.limitations.segmentation') }}</strong></li>
                <li><strong>{{ $t('about.detailed.limitations.abbreviations') }}</strong></li>
                <li><strong>{{ $t('about.detailed.limitations.substitute') }}</strong></li>
              </ul>
            </v-alert>

            <div class="d-flex justify-center flex-wrap">
              <v-btn 
                color="primary" 
                variant="elevated" 
                size="large"
                class="ma-2" 
                prepend-icon="mdi-arrow-collapse-up"
                @click="hideFull"
              >
                {{ $t('about.detailed.showShort') }}
              </v-btn>
              <v-btn 
                color="secondary"
                variant="tonal" 
                size="large"
                class="ma-2"
                prepend-icon="mdi-content-copy"
                @click="copyCitation"
              >
                {{ $t('about.intro.copyCitation') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-expand-transition>

      <!-- Contact -->
      <v-card class="contact-card" elevation="2">
        <v-card-text class="pa-8 text-center">
          <v-avatar size="64" color="primary" class="mb-4">
            <v-icon size="32" color="white">mdi-email</v-icon>
          </v-avatar>
          <h3 class="text-h5 font-weight-bold mb-3">{{ $t('about.contact.title') }}</h3>
          <div class="text-body-1 text-medium-emphasis mb-6 mx-auto" style="max-width: 600px;">
            {{ $t('about.contact.description') }}
          </div>
          <div class="d-flex justify-center flex-wrap">
            <v-btn 
              color="primary" 
              variant="elevated"
              size="large"
              class="ma-2" 
              prepend-icon="mdi-email"
              href="mailto:corpus-team@example.org"
            >
              {{ $t('about.contact.contactTeam') }}
            </v-btn>
            <v-btn 
              color="secondary" 
              variant="tonal" 
              size="large"
              class="ma-2"
              prepend-icon="mdi-github"
              @click="openProject"
            >
              {{ $t('about.contact.projectPage') }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <v-snackbar v-model="snackbar" timeout="2200" location="bottom right">
        {{ snackbarMsg }}
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showFullAbout = ref(false)
const snackbar = ref(false)
const snackbarMsg = ref('')
const preprintUrl = 'https://example.org/path/to/preprint.pdf'

function showFull(){ showFullAbout.value = true }
function hideFull(){ showFullAbout.value = false }

async function copyCitation(){
  const text = 'Transcribing the Middle Ages: A Massive 2.5-Billion-Token Corpus of Medieval Latin and French. (2025). [Corpus & pipeline description]. Authors. DOI: insert-DOI-here.'
  try{
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    snackbarMsg.value = t('about.citation.copied')
  } catch {
    snackbarMsg.value = t('about.citation.failed')
  }
  snackbar.value = true
}

function openProject(){
  window.open('#', '_blank', 'noopener')
}
</script>

<style scoped>
/* Enhanced Hero Section */
.hero-section {
  background: linear-gradient(135deg, #b45445 0%, #8b4513 50%, #a0522d 100%);
  padding: 3rem 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(180, 84, 69, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

.logo-enhanced {
  position: relative;
  width: 200px;
  height: 200px;
}

.logo-inner {
  width: 200px;
  height: 200px;
  border-radius: 32px;
  background: linear-gradient(135deg, #b45445, #a0522d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 16px 64px rgba(180, 84, 69, 0.4);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
  filter: brightness(1) saturate(1);
}

.logo-enhanced:hover .logo-inner {
  transform: scale(1.08) rotate(2deg);
  box-shadow: 0 24px 96px rgba(180, 84, 69, 0.6);
}

.logo-enhanced:hover .logo-image {
  filter: brightness(1.2) saturate(1.3);
  transform: scale(1.05);
}

.logo-glow {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(135deg, #b45445, #a0522d);
  border-radius: 40px;
  opacity: 0.3;
  filter: blur(30px);
  z-index: 1;
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1); 
    background: linear-gradient(135deg, #b45445, #a0522d);
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.15); 
    background: linear-gradient(135deg, #d2691e, #b45445);
  }
}

.hero-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3rem !important;
  font-weight: 800 !important;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 400;
  line-height: 1.6;
}

.hero-decoration {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, transparent);
  margin-top: 1rem;
  border-radius: 2px;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

/* Enhanced Stats Cards */
.stats-row {
  margin-top: -2rem;
  position: relative;
  z-index: 3;
}

.stat-card {
  background: white;
  border-radius: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.05);
}

.stat-card-primary:hover {
  box-shadow: 
    0 20px 40px rgba(103, 80, 164, 0.3),
    0 10px 20px rgba(103, 80, 164, 0.1);
}

.stat-card-secondary:hover {
  box-shadow: 
    0 20px 40px rgba(156, 39, 176, 0.3),
    0 10px 20px rgba(156, 39, 176, 0.1);
}

.stat-card-teal:hover {
  box-shadow: 
    0 20px 40px rgba(0, 150, 136, 0.3),
    0 10px 20px rgba(0, 150, 136, 0.1);
}

.stat-card-orange:hover {
  box-shadow: 
    0 20px 40px rgba(255, 152, 0, 0.3),
    0 10px 20px rgba(255, 152, 0, 0.1);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}

.stat-card:hover .stat-icon-wrapper {
  transform: rotate(5deg) scale(1.1);
}

.primary-gradient {
  background: linear-gradient(135deg, #6750a4, #8e24aa);
}

.secondary-gradient {
  background: linear-gradient(135deg, #9c27b0, #e91e63);
}

.teal-gradient {
  background: linear-gradient(135deg, #009688, #00bcd4);
}

.orange-gradient {
  background: linear-gradient(135deg, #ff9800, #ff5722);
}

.stat-number {
  font-size: 1.75rem !important;
  font-weight: 800 !important;
  line-height: 1;
  position: relative;
  z-index: 2;
}

.gradient-text-primary {
  background: linear-gradient(135deg, #6750a4, #8e24aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-secondary {
  background: linear-gradient(135deg, #9c27b0, #e91e63);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-teal {
  background: linear-gradient(135deg, #009688, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-orange {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 2;
}

.stat-sublabel {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  margin-top: 2px;
  position: relative;
  z-index: 2;
}

/* Intro Card */
.intro-card {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.02) 0%, rgba(14, 165, 164, 0.02) 100%);
  border: 1px solid rgba(103, 80, 164, 0.1);
}

.intro-text {
  line-height: 1.6;
}

.highlight-number {
  background: linear-gradient(135deg, #6750a4, #0ea5a4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* Feature Chips */
.feature-chips {
  margin-top: 2rem;
}

.feature-chip {
  padding: 12px 20px !important;
  height: auto !important;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.chip-label {
  font-size: 0.75rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chip-value {
  font-weight: 600;
  margin-top: 2px;
}

/* Action Buttons */
.action-buttons {
  margin-top: 2rem;
}

.action-btn {
  min-width: 140px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.025em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Detailed Card */
.detailed-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  border: 1px solid rgba(103, 80, 164, 0.08);
}

.gradient-text {
  background: linear-gradient(135deg, #6750a4, #0ea5a4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Contact Card */
.contact-card {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.02) 0%, rgba(14, 165, 164, 0.02) 100%);
  border: 1px solid rgba(103, 80, 164, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
  }
  
  .hero-title {
    font-size: 2.25rem !important;
  }
  
  .logo-enhanced {
    width: 150px;
    height: 150px;
    margin-right: 1rem !important;
  }
  
  .logo-inner {
    width: 150px;
    height: 150px;
    padding: 15px;
    border-radius: 24px;
  }
  
  .stats-row {
    margin-top: -1rem;
  }
  
  .stat-card:hover {
    transform: translateY(-4px) scale(1.01);
  }
  
  .stat-number {
    font-size: 1.5rem !important;
  }
  
  .stat-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .stat-icon-wrapper .v-icon {
    font-size: 28px !important;
  }
  
  .feature-chip {
    min-width: 140px;
    margin-bottom: 8px;
  }
  
  .intro-text {
    text-align: left;
  }
  
  .action-btn {
    min-width: 120px;
    margin: 4px !important;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .stat-number {
    font-size: 1.25rem !important;
  }
  
  .logo-enhanced {
    width: 120px !important;
    height: 120px !important;
  }
  
  .logo-inner {
    width: 120px !important;
    height: 120px !important;
    padding: 12px !important;
    border-radius: 20px !important;
  }
}
</style>