<template>
  <v-container class="py-6">
    <!-- Header Section -->
    <div class="hero-section mb-8">
      <v-row align="center" class="mb-6">
        <v-col cols="12" md="8">
          <div class="text-overline text-primary mb-2">{{ $t('projectInfo.overline') }}</div>
          <h1 class="display-1 font-weight-bold mb-4 gradient-text">
            {{ $t('projectInfo.title') }}
          </h1>
          <p class="text-h6 text-medium-emphasis mb-4">
            {{ $t('projectInfo.subtitle') }}
          </p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <div class="logo-container">
            <img src="@/assets/logo_dts.png" alt="CoMMA Logo" class="project-logo" />
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Main Content -->
    <v-row>
      <v-col cols="12" lg="8">
        <!-- Introduction -->
        <v-card class="mb-6" elevation="2">
          <v-card-text class="pa-6">
            <div class="text-body-1 mb-4">
              {{ $t('projectInfo.introduction.corpus') }}
              <a :href="config.catmusUrl" target="_blank" class="text-decoration-none">
                CATMuS
              </a>{{ $t('projectInfo.introduction.catmusDescription') }}
            </div>
            <!-- <div class="text-body-1">
              {{ $t('projectInfo.introduction.paper') }}
              <a :href="config.paperUrl" target="_blank" class="text-decoration-none font-weight-medium">
                {{ $t('projectInfo.introduction.paperLink') }}
              </a>
            </div> -->
          </v-card-text>
        </v-card>

        <!-- Paper & Credits -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.paper.title') }}
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="text-body-1 mb-4">
              {{ $t('projectInfo.paper.description') }}:
            </div>
            
            <!-- Paper citation box -->
            <v-alert 
              type="info" 
              variant="tonal" 
              class="mb-4"
              border="start"
              prominent
            >
              <div class="paper-citation">
                <h4 class="text-h6 font-weight-bold mb-2">
                  {{ $t('projectInfo.paper.paperTitle') }}
                </h4>
                <div class="text-body-2 mb-2 font-weight-medium">
                  {{ $t('projectInfo.paper.authors') }} ({{ $t('projectInfo.paper.year') }})
                </div>
                <div class="text-body-2 text-medium-emphasis mb-3" style="font-style: italic;">
                  {{ $t('projectInfo.paper.abstract') }}
                </div>
                <v-btn
                  :href="config.paperUrl"
                  target="_blank"
                  rel="noopener"
                  color="primary"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-open-in-new"
                >
                  {{ $t('projectInfo.paper.viewPaper') }}
                </v-btn>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Key Features -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.features.title') }}
          </v-card-title>
          <v-card-text class="pa-6">
            <v-list density="comfortable">
              <v-list-item
                v-for="(feature, index) in features"
                :key="index"
                class="px-0 mb-3"
              >
                <template #prepend>
                  <v-icon color="primary" class="mr-3 mt-1">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-body-1" style="white-space: normal; line-height: 1.6;">
                  <strong>{{ feature.title }}</strong><br>{{ feature.description }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Limitations -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.limitations.title') }}
          </v-card-title>
          <v-card-text class="pa-6">
            <v-alert type="warning" variant="tonal" class="mb-4">
              <div class="text-body-1">
                {{ $t('projectInfo.limitations.transcription') }}
              </div>
            </v-alert>
            <div class="text-body-1">
              {{ $t('projectInfo.limitations.coverage') }}
            </div>
          </v-card-text>
        </v-card>

        <!-- Projects & Funding -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.projects.title') }}
          </v-card-title>
          <v-card-text class="pa-6">
            <div class="text-body-1 mb-4">
              {{ $t('projectInfo.projects.description') }}
              <a :href="config.colafProjectUrl" target="_blank" class="text-decoration-none font-weight-medium">
                COLaF
              </a>
              {{ $t('projectInfo.projects.and') }} ParamHTRs.
            </div>
            <div class="text-body-1">
              {{ $t('projectInfo.projects.biblissima') }}
            </div>
          </v-card-text>
        </v-card>

        <!-- Technology -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.technology.title') }}
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- TexTile (DTS UI) -->
            <div class="tech-section mb-5">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-code-tags</v-icon>
                <div class="text-subtitle-1 font-weight-bold">{{ config.dtsUiName }}</div>
              </div>
              <div class="text-body-2 mb-2">
                {{ $t('projectInfo.technology.dtsUi.description') }}
              </div>
              <div class="d-flex flex-wrap gap-2 align-center">
                <v-chip
                  :href="config.dtsUiRepository"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="secondary"
                  variant="flat"
                  prepend-icon="mdi-github"
                  size="small"
                  class="tech-chip-small"
                >
                  {{ $t('projectInfo.technology.dtsUi.uiRepo') }}
                </v-chip>
                <v-chip
                  :href="config.dtsBackendRepository"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="secondary"
                  variant="flat"
                  prepend-icon="mdi-github"
                  size="small"
                  class="tech-chip-small"
                >
                  {{ $t('projectInfo.technology.dtsUi.backendRepo') }}
                </v-chip>
              </div>
            </div>

            <!-- MyDapytains -->
            <div class="tech-section mb-5">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-server</v-icon>
                <div class="text-subtitle-1 font-weight-bold">{{ config.mydapytainsName }}</div>
              </div>
              <div class="text-body-2 mb-2">
                {{ $t('projectInfo.technology.mydapytains.description') }}
              </div>
              <v-chip
                :href="config.mydapytainsRepository"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="flat"
                prepend-icon="mdi-github"
                size="small"
                class="tech-chip-small"
              >
                {{ $t('projectInfo.technology.mydapytains.viewRepo') }}
              </v-chip>
            </div>

            <!-- Kraken -->
            <div class="tech-section mb-5">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-ocr</v-icon>
                <div class="text-subtitle-1 font-weight-bold">Kraken</div>
              </div>
              <div class="text-body-2 mb-2">
                {{ $t('projectInfo.technology.kraken.description') }}
              </div>
              <v-chip
                href="https://github.com/mittagessen/kraken"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="flat"
                prepend-icon="mdi-github"
                size="small"
                class="tech-chip-small"
              >
                {{ $t('projectInfo.technology.kraken.viewRepo') }}
              </v-chip>
            </div>

            <!-- CATMuS Medieval -->
            <div class="tech-section">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-script-text-key</v-icon>
                <div class="text-subtitle-1 font-weight-bold">CATMuS Medieval</div>
              </div>
              <div class="text-body-2 mb-2">
                {{ $t('projectInfo.technology.catmus.description') }}
              </div>
              <v-chip
                href="https://inria.hal.science/hal-04453952"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="flat"
                prepend-icon="mdi-file-document"
                size="small"
                class="tech-chip-small"
              >
                {{ $t('projectInfo.technology.catmus.viewPaper') }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" lg="4">
        <!-- Stats Card -->
        <v-card class="mb-6 stats-card" elevation="3">
          <v-card-title class="text-h6 font-weight-bold text-center bg-primary text-white">
            {{ $t('projectInfo.stats.title') }}
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="text-center mb-4">
              <div class="display-2 font-weight-bold text-primary">{{ manuscriptCountFormatted }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ $t('projectInfo.stats.manuscripts') }}</div>
            </div>
            <div class="text-center mb-4">
              <div class="display-2 font-weight-bold text-secondary">2.5B</div>
              <div class="text-body-2 text-medium-emphasis">{{ $t('projectInfo.stats.words') }}</div>
            </div>
            <div class="text-center">
              <div class="text-h4 font-weight-bold text-teal">800–1600</div>
              <div class="text-body-2 text-medium-emphasis">{{ $t('projectInfo.stats.timespan') }}</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Languages Card -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.languages.title') }}
          </v-card-title>
          <v-card-text>
            <v-chip-group column>
                            <v-chip variant="outlined" size="small" class="ma-1">
                {{ $t('projectInfo.languages.latin') }}
              </v-chip>
              <v-chip variant="outlined" size="small" class="ma-1">
                {{ $t('projectInfo.languages.oldFrench') }}
              </v-chip>
              <v-chip variant="outlined" size="small" class="ma-1">
                {{ $t('projectInfo.languages.italian') }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>

        <!-- Sources Card -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.sources.title') }}
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item href="https://portail.biblissima.fr/" target="_blank" rel="noopener">
                <template #prepend>
                  <v-icon size="small" color="primary">mdi-library</v-icon>
                </template>
                <v-list-item-title class="text-body-2">Biblissima</v-list-item-title>
                <template #append>
                  <v-icon size="small" color="grey">mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
              <v-list-item href="https://gallica.bnf.fr/accueil/fr/html/accueil-fr" target="_blank" rel="noopener">
                <template #prepend>
                  <v-icon size="small" color="primary">mdi-library</v-icon>
                </template>
                <v-list-item-title class="text-body-2">BnF Gallica</v-list-item-title>
                <template #append>
                  <v-icon size="small" color="grey">mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
              <v-list-item href="https://arca.irht.cnrs.fr/" target="_blank" rel="noopener">
                <template #prepend>
                  <v-icon size="small" color="primary">mdi-library</v-icon>
                </template>
                <v-list-item-title class="text-body-2">ARCA</v-list-item-title>
                <template #append>
                  <v-icon size="small" color="grey">mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
              <v-list-item href="https://www.e-codices.unifr.ch/en" target="_blank" rel="noopener">
                <template #prepend>
                  <v-icon size="small" color="primary">mdi-library</v-icon>
                </template>
                <v-list-item-title class="text-body-2">E-Codices</v-list-item-title>
                <template #append>
                  <v-icon size="small" color="grey">mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
              <v-list-item href="https://www.bodleian.ox.ac.uk/home" target="_blank" rel="noopener">
                <template #prepend>
                  <v-icon size="small" color="primary">mdi-library</v-icon>
                </template>
                <v-list-item-title class="text-body-2">Bodleian Library</v-list-item-title>
                <template #append>
                  <v-icon size="small" color="grey">mdi-open-in-new</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Contact Card -->
        <v-card elevation="2">
          <v-card-title class="text-h6 font-weight-bold text-center bg-secondary text-white">
            {{ $t('projectInfo.contact.title') }}
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-3">
              {{ $t('projectInfo.contact.description') }}
            </div>
            <v-btn 
              color="primary" 
              variant="outlined" 
              block 
              :href="`mailto:${config.contactEmail}`"
              prepend-icon="mdi-email"
            >
              {{ $t('projectInfo.contact.button') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import config from '@/config/urls.js'
import { fetchManuscriptCount } from '@/api/dts.js'

const { t } = useI18n()

// Reactive manuscript count
const manuscriptCount = ref(23000) // Fallback value
const manuscriptCountFormatted = ref('23k+') // Fallback formatted value

// Function to format manuscript count with k+ suffix
function formatManuscriptCount(count) {
  if (count >= 1000000) {
    return `${Math.floor(count / 100000) / 10}M+`
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}k+`
  }
  return `${count}+`
}

// Function to load manuscript count
async function loadManuscriptCount() {
  try {
    const response = await fetchManuscriptCount()
    if (response && response.total_manuscripts) {
      manuscriptCount.value = response.total_manuscripts
      manuscriptCountFormatted.value = formatManuscriptCount(response.total_manuscripts)
    }
  } catch (error) {
    console.warn('Failed to fetch manuscript count for ProjectInfo:', error)
    // Keep the fallback values
  }
}

// Use hardcoded features for now since i18n array handling is problematic
const features = computed(() => {
  // Try to get from i18n first
  try {
    const items = t('projectInfo.features.items', undefined, { returnObjects: true })
    if (Array.isArray(items) && items.length > 0) {
      return items
    }
  } catch (e) {
    console.log('i18n array access failed:', e)
  }
  
  // Fallback based on current locale
  const currentLocale = t('projectInfo.features.title') // Check if we can access any i18n
  const isFrench = currentLocale === 'Caractéristiques du Corpus'
  
  if (isFrench) {
    return [
      {
        title: 'Un corpus massif :',
        description: 'plus de 23 000 manuscrits, environ 2,5 milliards de mots en latin et en ancien français.'
      },
      {
        title: 'Un empan chronologique important :',
        description: 'du 9e siècle au 16e siècle inclu !'
      },
      {
        title: 'Des sources issues de grandes bibliothèques numériques européennes :',
        description: '(BnF Gallica, Bodleian, e-codices, etc.).'
      },
      {
        title: 'Une approche innovante :',
        description: 'textes transcrits automatiquement à partir des images, sans normalisation éditoriale, permettant d\'explorer la richesse et la diversité de l\'écrit médiéval.'
      },
      {
        title: 'Un outil pour les sciences et les technologies :',
        description: 'ressource librement disponible, utile aussi bien pour les humanités numériques (histoire de la langue, philologie, histoire du livre) que pour les sciences informatiques (entraînement de modèles de traitement automatique du langage).'
      },
      {
        title: 'Perspectives :',
        description: 'le corpus sera progressivement enrichi de nouveaux fonds et de nouvelles langues médiévales, incluant l\'italien et d\'autres traditions.'
      }
    ]
  } else {
    return [
      {
        title: 'A massive corpus:',
        description: 'more than 23,000 manuscripts, approximately 2.5 billion words in Latin and Old French.'
      },
      {
        title: 'Significant chronological span:',
        description: 'from the 9th century to the 16th century inclusive!'
      },
      {
        title: 'Sources from major European digital libraries:',
        description: '(BnF Gallica, Bodleian, e-codices, etc.).'
      },
      {
        title: 'An innovative approach:',
        description: 'texts automatically transcribed from images, without editorial normalization, allowing exploration of the richness and diversity of medieval writing.'
      },
      {
        title: 'A tool for science and technology:',
        description: 'freely available resource, useful both for digital humanities (language history, philology, book history) and computer science (training automatic language processing models).'
      },
      {
        title: 'Prospects:',
        description: 'the corpus will be progressively enriched with new collections and new medieval languages, including Italian and other traditions.'
      }
    ]
  }
})

onMounted(() => {
  loadManuscriptCount()
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, rgba(14, 165, 164, 0.05) 100%);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.gradient-text {
  background: linear-gradient(135deg, #6750a4, #0ea5a4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.project-logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.logo-container {
  padding: 1rem;
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.1), rgba(14, 165, 164, 0.1));
  border-radius: 50%;
  display: inline-block;
}

.stats-card .v-card-title,
.v-card .v-card-title {
  border-radius: 4px 4px 0 0;
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
  align-items: flex-start !important;
}

:deep(.v-list-item__content) {
  overflow: visible !important;
}

:deep(.v-list-item-title) {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
}

.v-card {
  border-radius: 12px !important;
}

.paper-citation {
  line-height: 1.6;
}

.paper-citation h4 {
  color: #1976d2 !important;
}

.paper-citation .text-body-2 {
  line-height: 1.5;
}

/* Technology Section Styling */
.tech-section {
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.03) 0%, rgba(14, 165, 164, 0.03) 100%);
  border-left: 3px solid rgba(103, 80, 164, 0.3);
  transition: all 0.3s ease;
}

.tech-section:hover {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, rgba(14, 165, 164, 0.05) 100%);
  border-left-color: rgba(103, 80, 164, 0.6);
  transform: translateX(4px);
}

.tech-chip {
  font-weight: 600;
  padding: 20px 20px !important;
  height: auto !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
}

.tech-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tech-chip :deep(.v-chip__prepend) {
  margin-right: 8px;
}

.tech-chip-small {
  font-weight: 500;
  border-radius: 8px !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
}

.tech-chip-small:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.tech-chip-small :deep(.v-chip__prepend) {
  margin-right: 6px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1rem;
  }
  
  .project-logo {
    width: 80px;
    height: 80px;
  }
  
  .hero-section h1 {
    font-size: 1.5rem !important;
  }
  
  .hero-section .text-h4 {
    font-size: 1.2rem !important;
  }
}

@media (max-width: 600px) {
  .hero-section .v-row {
    flex-direction: column-reverse;
  }
  
  .v-card {
    margin-bottom: 1rem !important;
  }
}
</style>