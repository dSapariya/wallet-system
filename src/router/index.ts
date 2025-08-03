import { createRouter, createWebHistory } from 'vue-router'
import WalletSetup from '../views/WalletSetup.vue'
import TransactionsTable from '../views/TransactionsTable.vue'

const routes = [
  {
    path: '/',
    name: 'WalletSetup',
    component: WalletSetup
  },
  {
    path: '/transactions',
    name: 'TransactionsTable',
    component: TransactionsTable
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 