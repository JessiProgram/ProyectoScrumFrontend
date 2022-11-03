<template>
    <v-app>
        <!-- Navigation -->
        <NavDefault />

        <!-- Main -->
        <main class="layoutDefault__main">
            <slot />
        </main>

        <!-- Footer -->
        <FooterDefault />
    </v-app>
</template>

<script>
import NavDefault from '@/components/NavDefault.vue';
import FooterDefault from '@/components/FooterDefault.vue';

export default {
    components: {
        NavDefault,
        FooterDefault,
    },
}
</script>

<style scoped>
.layoutDefault__main {
    margin-top: 50px;
    margin-bottom: 100px;
}
</style>