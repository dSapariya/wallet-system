import { createRouter, createWebHistory } from 'vue-router'
import WalletSetup from '../views/WalletSetup.vue'
import TransactionsTable from '../views/TransactionsTable.vue'
import { showErrorToast } from '../plugins/notification' 
import { storage } from '../config' 

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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const walletId = localStorage.getItem(storage.walletId)

  // If someone try to access transactions page without walletId, redirect to setup
  if (to.name === 'TransactionsTable' && !walletId) {
    showErrorToast('Wallet details not found. Please set up your wallet.')
    next({ name: 'WalletSetup' }) // Redirect to WalletSetup page
  } else {
    next() 
  }
})

export default router 