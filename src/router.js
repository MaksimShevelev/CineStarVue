import { createRouter, createWebHistory } from 'vue-router';
import ListaPeliculas from './ListaPeliculas.vue'; 
import DetallesPelicula from './DetallesPelicula.vue'; 

const routes = [
  {
    path: '/',
    name: 'listaPeliculas',
    component: ListaPeliculas
  },
  {
    path: '/detalles/:id',
    name: 'detalles',
    component: DetallesPelicula
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
