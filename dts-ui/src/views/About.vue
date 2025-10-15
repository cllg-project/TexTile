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
        
        <!-- Search Bar with Download Button -->
        <div class="search-section mt-8">
          <div class="search-container-with-arrows">
            <!-- Left Arrow - Background Layer -->
            <div 
              ref="leftArrow" 
              class="arrow-left"
              :style="{ 
                width: '169px', 
                height: '161px'
              }"
            ></div>
            
            <!-- Right Arrow - Background Layer -->
            <div 
              ref="rightArrow" 
              class="arrow-right"
              :style="{ 
                width: '169px', 
                height: '161px'
              }"
            ></div>
            
            <!-- Top Arrows - Extra Layer -->
            <div 
              ref="topArrow1" 
              class="arrow-top-1"
              :style="{ 
                width: '169px', 
                height: '161px'
              }"
            ></div>
            
            <div 
              ref="topArrow3" 
              class="arrow-top-3"
              :style="{ 
                width: '169px', 
                height: '161px'
              }"
            ></div>
            
            <!-- Main Search Section - Foreground -->
            <div class="d-flex align-center justify-center main-search-area" style="gap: 1rem;">
              <!-- Animated Search Bar -->
              <div class="search-container" style="max-width: 500px; flex: 1;">
                <v-text-field
                  v-model="searchQuery"
                  :placeholder="$t('about.intro.searchPlaceholder')"
                  variant="outlined"
                  density="comfortable"
                  class="search-field"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  hide-details
                  @keyup.enter="performSearch"
                >
                  <template #append-inner>
                    <v-btn
                      color="primary"
                      variant="flat"
                      size="small"
                      class="search-btn"
                      @click="performSearch"
                      :disabled="!searchQuery?.trim()"
                    >
                      Search
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
              

            </div>
          </div>
          
          <!-- Quick Search Suggestions -->
          <div class="d-flex justify-center flex-wrap mt-4">
            <v-chip
              v-for="suggestion in quickSearches"
              :key="suggestion"
              class="ma-1 suggestion-chip"
              variant="outlined"
              size="small"
              @click="searchQuery = suggestion; performSearch()"
            >
              {{ suggestion }}
            </v-chip>
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
                <div class="stat-number gradient-text-secondary">{{ manuscriptCountFormatted }}</div>
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
                <div class="stat-number gradient-text-orange">3</div>
                <div class="stat-label">{{ $t('about.stats.languages') }}</div>
                <div class="stat-sublabel">Latin, Old French & Italian</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Intro + meta -->
      <v-card class="mb-6 intro-card" elevation="3">
        <v-card-text class="pa-8">
          <div class="intro-text text-h6 text-center mb-6">
            {{ $t('about.intro.browsableCollection', { count: manuscriptCountFormatted }) }}
            <br><br>
            <span class="text-body-1 text-medium-emphasis">
              {{ $t('about.intro.preservation') }}
            </span>
            <br><br>
            <span class="text-body-2 text-medium-emphasis">
              {{ $t('about.intro.paperDescription') }}
              <a href="https://inria.hal.science/hal-05299220" target="_blank" rel="noopener" class="text-primary font-weight-medium text-decoration-none">
                {{ $t('about.intro.paperTitle') }}
              </a>
              {{ $t('about.intro.paperAuthors') }}
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
                  <div class="chip-value">Latin, Old French, Italian</div>
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
                  <div class="chip-value">{{ manuscriptCountFormatted }}</div>
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
              @click="openPreprint" 
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
                          <!-- Expandable Download Button -->
              <div class="download-button-container">
                <v-btn
                  class="download-expandable-btn"
                  color="teal"
                  variant="elevated"
                  size="large"
                  href="https://huggingface.co/datasets/comma-project/comma-jsonl"
                  target="_blank"
                  rel="noopener"
                >
                  <v-icon class="download-icon">mdi-download</v-icon>
                  <span class="download-text">{{ $t('about.intro.downloadCorpus') }}</span>
                </v-btn>
              </div>
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
            </div>
          </v-card-text>
        </v-card>
      </v-expand-transition>

      <!-- Sponsors Section -->
      <v-card class="sponsors-card mb-6" elevation="4">
        <v-card-text class="pa-8 text-center">
          <!-- <h3 class="text-h5 font-weight-bold mb-4">{{ $t('about.sponsors.title') }}</h3> -->
          
          <!-- Logos Row -->
          <v-row justify="center" align="center" class="sponsors-logos mb-6">
            <v-col cols="12" sm="4" md="3" class="d-flex justify-center">
              <div class="sponsor-logo-wrapper">
                <img 
                  v-if="$vuetify.theme.current.dark" 
                  src="@/assets/biblissima_logo_dark_mode.png" 
                  alt="Biblissima+" 
                  class="sponsor-logo"
                />
                <img 
                  v-else 
                  src="@/assets/biblissima_logo_white_mode.png" 
                  alt="Biblissima+" 
                  class="sponsor-logo"
                />
              </div>
            </v-col>
            <v-col cols="12" sm="4" md="3" class="d-flex justify-center">
              <div class="sponsor-logo-wrapper">
                <img 
                  v-if="$vuetify.theme.current.dark" 
                  src="@/assets/france2030_logo_dark_mode.png" 
                  alt="France 2030" 
                  class="sponsor-logo"
                />
                <img 
                  v-else 
                  src="@/assets/france2030_logo_white_mode.jpg" 
                  alt="France 2030" 
                  class="sponsor-logo"
                />
              </div>
            </v-col>
            <v-col cols="12" sm="4" md="3" class="d-flex justify-center">
              <div class="sponsor-logo-wrapper">
                <img 
                  v-if="$vuetify.theme.current.dark" 
                  src="@/assets/inria_logo_dark_mode.png" 
                  alt="Inria" 
                  class="sponsor-logo"
                />
                <img 
                  v-else 
                  src="@/assets/inria_logo_white_mode.png" 
                  alt="Inria" 
                  class="sponsor-logo"
                />
              </div>
            </v-col>
          </v-row>

          <!-- Funding Text -->
          <div class="funding-text text-body-2 text-medium-emphasis mx-auto" style="max-width: 800px;">
            {{ $t('about.sponsors.fundingText') }}
          </div>
        </v-card-text>
      </v-card>

      <!-- Contact -->
      <!-- <v-card class="contact-card" elevation="2">
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
              :href="`mailto:${config.contactEmail}`"
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
      </v-card> -->

      <v-snackbar v-model="snackbar" timeout="2200" location="bottom right">
        {{ snackbarMsg }}
      </v-snackbar>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import lottie from 'lottie-web'
import arrow1Animation from '@/assets/arrow5.json'
import Arrow2Animation from '@/assets/arrow3.json'
import Arrow3Animation from '@/assets/arrow6.json'
import Arrow5Animation from '@/assets/arrow11.json'
import config from '@/config/urls.js'
import { fetchManuscriptCount } from '@/api/dts.js'

const { t } = useI18n()
const router = useRouter()

const showFullAbout = ref(false)
const snackbar = ref(false)
const snackbarMsg = ref('')
const manuscriptCount = ref(23467) // Fallback value
const manuscriptCountFormatted = ref('23,467') // Fallback formatted value


// Arrow refs
const leftArrow = ref(null)
const rightArrow = ref(null)
const topArrow1 = ref(null)
const topArrow3 = ref(null)

// Search functionality
const searchQuery = ref('')
const quickSearches = ref([
  'amor',
  'deus',
  'rex',
  'ecclesia',
  'sanctus',
  'miraculum'
])

function showFull(){ showFullAbout.value = true }
function hideFull(){ showFullAbout.value = false }

async function copyCitation(){
  const text = config.citationText
  try{
    await navigator.clipboard.writeText(text)
    snackbarMsg.value = t('about.citation.copied')
  } catch {
    snackbarMsg.value = t('about.citation.failed')
  }
  snackbar.value = true
}

function openProject(){
  window.open(config.projectPageUrl, '_blank', 'noopener')
}

function openPreprint(){
  window.open(config.preprintUrl, '_blank', 'noopener')
}

function performSearch() {
  if (!searchQuery.value?.trim()) return
  
  // Navigate to search view with the query
  router.push({
    name: 'search',
    query: {
      q: searchQuery.value.trim(),
      type: 'traditional'
    }
  })
}

// Initialize Lottie animations
let leftArrowAnimation = null
let rightArrowAnimation = null
let topArrow1Animation = null
let topArrow3Animation = null

// Function to change animation colors
function changeAnimationColor(animationData, newColor) {
  const modifiedData = JSON.parse(JSON.stringify(animationData))
  
  // Function to recursively find and change stroke colors
  function updateColors(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(updateColors)
    } else if (typeof obj === 'object' && obj !== null) {
      if (obj.ty === 'st' && obj.c && obj.c.k) { // stroke color
        obj.c.k = newColor // [r, g, b, a] where values are 0-1
      }
      Object.values(obj).forEach(updateColors)
    }
  }
  
  updateColors(modifiedData)
  return modifiedData
}

// Function to load manuscript count
async function loadManuscriptCount() {
  try {
    const response = await fetchManuscriptCount()
    if (response && response.total_manuscripts) {
      manuscriptCount.value = response.total_manuscripts
      // Format number with commas
      manuscriptCountFormatted.value = response.total_manuscripts.toLocaleString()
    }
  } catch (error) {
    console.warn('Failed to fetch manuscript count:', error)
    // Keep the fallback values
  }
}

onMounted(() => {
  if (leftArrow.value) {
    // Change to white: [1, 1, 1, 1]
    // Change to blue: [0.2, 0.4, 0.8, 1]
    // Change to red: [0.8, 0.2, 0.2, 1]
    const coloredArrowData = changeAnimationColor(Arrow2Animation, [1, 1, 1, 1])
    
    leftArrowAnimation = lottie.loadAnimation({
      container: leftArrow.value,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: coloredArrowData
    })
    
    // Play animation every 10 seconds
    const playLeftArrow = () => {
      leftArrowAnimation.goToAndPlay(1000)
    }
    leftArrowAnimation.goToAndPlay(0) // Play once immediately
    setInterval(playLeftArrow, 4000) // Then every 5 seconds
  }
  
  if (rightArrow.value) {
    // Apply same color change to right arrow
    const coloredArrowData = changeAnimationColor(arrow1Animation, [1, 1, 1, 1])
    
    rightArrowAnimation = lottie.loadAnimation({
      container: rightArrow.value,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: coloredArrowData
    })
    
    // Play animation every 10 seconds
    const playRightArrow = () => {
      rightArrowAnimation.goToAndPlay(1000)
    }
    rightArrowAnimation.goToAndPlay(0) // Play once immediately
    setInterval(playRightArrow, 4000) // Then every 5 seconds
  }
  
  // Initialize top arrows (using different arrow animations)
  if (topArrow1.value) {
    const coloredArrowData = changeAnimationColor(Arrow3Animation, [1, 1, 1, 1])
    
    topArrow1Animation = lottie.loadAnimation({
      container: topArrow1.value,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: coloredArrowData
    })
    
    const playTopArrow1 = () => {
      topArrow1Animation.goToAndPlay(1000)
    }
    topArrow1Animation.goToAndPlay(0)
    setInterval(playTopArrow1, 4000) // Every 5 seconds
  }
  
  if (topArrow3.value) {
    const coloredArrowData = changeAnimationColor(Arrow5Animation, [1, 1, 1, 1])
    
    topArrow3Animation = lottie.loadAnimation({
      container: topArrow3.value,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: coloredArrowData
    })
    
    const playTopArrow3 = () => {
      topArrow3Animation.goToAndPlay(1000)
    }
    topArrow3Animation.goToAndPlay(0)
    setInterval(playTopArrow3, 4000) // Every 4 seconds
  }
  
  // Load manuscript count
  loadManuscriptCount()
})
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
  /*margin-top: -2rem; */
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

/* Commented out card hover animations - uncomment these sections to restore animations */
/*
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
*/

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

/*
.stat-card:hover .stat-icon-wrapper {
  transform: rotate(5deg) scale(1.1);
}
*/

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

/* Sponsors Card */
.sponsors-card {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.03) 0%, rgba(14, 165, 164, 0.03) 100%);
  border: 1px solid rgba(103, 80, 164, 0.12);
}

.sponsors-logos {
  margin: 2rem 0;
}

.sponsor-logo-wrapper {
  width: 100%;
  max-width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.sponsor-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(0%);
  opacity: 0.9;
  transition: all 0.3s ease;
}

.sponsor-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
}

.funding-text {
  font-size: 0.875rem;
  line-height: 1.6;
  font-style: italic;
  color: var(--v-theme-on-surface-variant);
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
  
  .search-container {
    padding: 0 16px;
  }
  
  .search-field {
    margin-bottom: 16px;
  }
  
  .suggestion-chip {
    margin: 4px 2px;
  }
  
  .download-card {
    margin-top: 16px;
  }
}

/* Search Hero Card Animations */
.search-hero-card {
  border-radius: 24px !important;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  overflow: hidden;
}

.search-hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6750a4, #8e24aa, #00bcd4);
  margin: -2px;
  border-radius: 24px;
  z-index: -1;
}

.search-container {
  position: relative;
  z-index: 2;
}

:deep(.search-field .v-field) {
  border-radius: 16px !important;
  background: white;
  box-shadow: 
    0 8px 32px rgba(103, 80, 164, 0.1),
    0 4px 16px rgba(103, 80, 164, 0.05);
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.search-field .v-field:hover) {
  box-shadow: 
    0 12px 48px rgba(103, 80, 164, 0.15),
    0 6px 24px rgba(103, 80, 164, 0.08);
  transform: translateY(-2px);
}

:deep(.search-field .v-field--focused) {
  border-color: #6750a4;
  box-shadow: 
    0 16px 64px rgba(103, 80, 164, 0.2),
    0 8px 32px rgba(103, 80, 164, 0.1),
    0 0 0 4px rgba(103, 80, 164, 0.1);
  transform: translateY(-4px);
}

:deep(.search-field .v-field__input) {
  font-size: 1.1rem;
  font-weight: 400;
  padding: 16px 20px;
}

.search-btn {
  border-radius: 12px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
}

.search-btn:hover {
  transform: scale(1.05);
}

.suggestion-chip {
  transition: all 0.2s ease;
  cursor: pointer;
  border-color: rgba(103, 80, 164, 0.3) !important;
  color: #6750a4 !important;
}

.suggestion-chip:hover {
  background-color: rgba(103, 80, 164, 0.1) !important;
  border-color: #6750a4 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 80, 164, 0.2);
}

/* Download Card Animations */
.download-card {
  border-radius: 24px !important;
  background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.download-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(0, 150, 136, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(0, 188, 212, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.download-content {
  position: relative;
  z-index: 2;
}

.download-icon {
  transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), margin-right 0.3s ease;
}
.download-button-container:hover .download-icon {
  margin-right: 8px;
  transform: rotate(360deg);
}

.download-card:hover .download-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 16px 32px rgba(0, 150, 136, 0.3);
}

.download-btn {
  border-radius: 16px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.025em;
  padding: 12px 32px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.download-btn:hover::before {
  left: 100%;
}

.download-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 16px 32px rgba(0, 150, 136, 0.3),
    0 8px 16px rgba(0, 150, 136, 0.15);
}

.download-btn:active {
  transform: translateY(-2px) scale(1.02);
}

/* Action buttons improvements */
.action-btn {
  border-radius: 16px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-3px);
}

/* Gradient text utility */
.gradient-text-primary {
  background: linear-gradient(135deg, #6750a4, #8e24aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Search Section in Hero */
.search-section {
  position: relative;
  z-index: 4;
}

/* Arrow Container */
.search-container-with-arrows {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.main-search-area {
  flex: 1;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.arrow-left,
.arrow-right {
  position: absolute;
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3)) 
          brightness(0) saturate(100%) 
          invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  transition: all 0.3s ease;
  z-index: 1;
  pointer-events: none; /* Prevents blocking interactions */
}

.arrow-left {
  left: -150px; /* Adjust this value to move left arrow */
  top: 50%;
  transform: translateY(-15%) translateX(175%) rotate(-40deg) scaleY(-1);
}

.arrow-right {
  right: -150px; /* Adjust this value to move right arrow */
  top: 50%;
  transform: translateY(-23%) translateX(-180%) rotate(200deg) scaleY(-1);
}

.arrow-left:hover,
.arrow-right:hover {
  opacity: 0.8;
  transform: translateY(-50%) scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(255, 255, 255, 0.5))
          brightness(0) saturate(100%) 
          invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
}

.arrow-left:hover {
  transform: translateY(-50%) rotate(180deg) scaleY(-1) scale(1.1);
}

/* Top Arrows */
.arrow-top-1,
.arrow-top-3 {
  position: absolute;
  opacity: 0.6;
  filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3)) 
          brightness(0) saturate(100%) 
          invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  transition: all 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.arrow-top-1 {
  top: -120px;
  left: -50px;
  transform: rotate(35deg) translateY(-40%) translateX(78%);
}

.arrow-top-3 {
  top: -120px;
  right: -50px;
  transform: rotate(135deg) translateY(80%) translateX(65%);
}

.arrow-top-1:hover,
.arrow-top-3:hover {
  opacity: 0.8;
  transform: scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(255, 255, 255, 0.5))
          brightness(0) saturate(100%) 
          invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
}

.search-container {
  position: relative;
}

:deep(.search-field .v-field) {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.search-field .v-field:hover) {
  background: rgba(255, 255, 255, 1);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.2),
    0 6px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
}

:deep(.search-field .v-field--focused) {
  background: rgba(255, 255, 255, 1);
  border-color: #6750a4;
  box-shadow: 
    0 16px 64px rgba(103, 80, 164, 0.3),
    0 8px 32px rgba(103, 80, 164, 0.2),
    0 0 0 4px rgba(103, 80, 164, 0.1);
  transform: translateY(-4px);
}

:deep(.search-field .v-field__input) {
  font-size: 1.1rem;
  font-weight: 400;
  padding: 16px 20px;
  color: rgba(0, 0, 0, 0.87);
}

.search-btn {
  border-radius: 12px !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
}

.search-btn:hover {
  transform: scale(1.05);
}

.suggestion-chip {
  transition: all 0.2s ease;
  cursor: pointer;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.suggestion-chip:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Expandable Download Button */
.download-button-container {
  width: 250px;
  transition: width 0.3s ease;
}
.download-expandable-btn {
  width: 100%;                    /* take the container’s animated width */
  border-radius: 50px !important;
  margin-top: 8px !important  ;
  height: 44px !important;
  padding: 0 24px !important;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 150, 136, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* not width here */
}


.download-expandable-btn:hover {
  min-width: 220px !important;
  padding: 0 24px !important;
  box-shadow: 
    0 16px 32px rgba(0, 150, 136, 0.4),
    0 8px 16px rgba(0, 150, 136, 0.2);
  transform: translateY(-2px);
}

.download-icon {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
  margin-right: 8px;
}

.download-expandable-btn:hover .download-icon {
  transform: rotate(360deg);
}

.download-text {
  display: inline-block;
  white-space: nowrap;
  opacity: 1;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Responsive adjustments for search section */
@media (max-width: 768px) {
  .search-section {
    margin-top: 2rem !important;
  }
  
  .arrow-left,
  .arrow-right,
  .arrow-top-1,
  .arrow-top-3 {
    display: none !important; /* Hide all arrows on mobile and tablets */
  }
  
  .main-search-area {
    max-width: 100% !important;
  }
  
  .main-search-area .d-flex {
    flex-direction: column;
    gap: 16px !important;
    align-items: stretch !important;
  }
  
  .search-container {
    max-width: 100% !important;
  }
  
  .download-expandable-btn {
    align-self: center;
  }
  
  .download-expandable-btn:hover {
    min-width: 180px !important;
  }
}

@media (max-width: 1024px) {
  .arrow-left,
  .arrow-right,
  .arrow-top-1,
  .arrow-top-3 {
    display: none !important; /* Hide all arrows on tablets and below */
  }
  
  .arrow-left {
    left: -100px; /* Closer to search bar on tablets */
  }
  
  .arrow-right {
    right: -100px; /* Closer to search bar on tablets */
  }
  
  .arrow-left,
  .arrow-right {
    width: 80px !important;
    height: 50px !important;
  }
}

@media (min-width: 1200px) {
  .arrow-left {
    left: -200px; /* Further away on larger screens */
  }
  
  .arrow-right {
    right: -200px; /* Further away on larger screens */
  }
}

@media (max-width: 480px) {
  .search-section .d-flex {
    gap: 12px !important;
  }
  
  .download-expandable-btn:hover {
    min-width: 160px !important;
  }
  
  .suggestion-chip {
    margin: 2px !important;
    font-size: 0.75rem !important;
  }
}
</style>