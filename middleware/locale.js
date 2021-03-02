export default function({ store, redirect, route }) {

    // Do not run on server
    if (process.server) {
      return
    }
  
    const user = localStorage.getItem('user')
    const loggedStatus = store.getters['isLoggedIn']
  
    if (user) {
      if (route.path == '/login' || route.path == '/user/temporary') {
        return redirect('/')
      }
      return
    }
  
    if (!user) {
      return redirect('/login')
    }
  }