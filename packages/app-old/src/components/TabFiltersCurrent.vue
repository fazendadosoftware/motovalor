<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <back-button to="models" close />
        </ion-buttons>
        <ion-title>Filtros</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-y="false">
      <filter-component />
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons
} from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import FilterComponent from '@/components/FilterComponent.vue'
</script>
