<template>
  <ion-page>
    <ion-tabs @ionTabsWillChange="beforeTabChange" @ionTabsDidChange="afterTabChange">
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" href="/filters/current">
          <ion-icon :icon="calendar" />
          <ion-label>Atuais</ion-label>
          <ion-badge>6</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="speakers" href="/filters/saved">
          <ion-icon :icon="personCircle" />
          <ion-label>Salvos</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonBadge,
  IonRouterOutlet
} from '@ionic/vue'
import { calendar, personCircle } from 'ionicons/icons'

const beforeTabChange = () => {}
const afterTabChange = () => {}
</script>
