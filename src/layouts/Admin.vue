<template>
    <v-app>
        <!-- Navigation -->
        <NavAdmin />

        <!-- Main -->
        <main class="layoutDefault__main">
            <slot />
        </main>

        <!-- Footer -->
        <FooterDefault />
    </v-app>
</template>

<script>
import NavAdmin from '@/components/NavAdmin.vue';
import FooterDefault from '@/components/FooterDefault.vue';

export default {
    components: {
        NavAdmin,
        FooterDefault,
    },
}
</script>

<style scoped>
.layoutDefault__main {
    margin-top: 70px;
    margin-bottom: 100px;
}
</style>