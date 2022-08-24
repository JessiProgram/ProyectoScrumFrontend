<template>
    <v-app>
        <!-- Navigation -->
        <NavGuest />

        <!-- Main -->
        <main class="layoutDefault__main">
            <slot />
        </main>

        <!-- Footer -->
        <FooterDefault />
    </v-app>
</template>

<script>
import NavGuest from '@/components/NavGuest.vue';
import FooterDefault from '@/components/FooterDefault.vue';

export default {
    components: {
        NavGuest,
        FooterDefault
    },
}
</script>

<style scoped>
.layoutDefault__main {
    margin-top: 100px;
}
</style>