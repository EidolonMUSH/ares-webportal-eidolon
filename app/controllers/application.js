import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import AvailableRoutes from 'ares-webportal/mixins/available-routes';

export default Controller.extend(AuthenticatedController, AvailableRoutes, {
    session: service('session'),
    gameSocket: service(),
    hideSidebar: false,
    refreshSidebar: false,
    sidebarModel: {},

    currentRoute: function() {
        return window.location;
    }.property(),
    
    mushName: function() { 
        return this.get('model.game.name');
    }.property(),
    
    mushPort: function() {
        return aresconfig.mush_port;        
    }.property(),
    
    mushHost: function() {
        return aresconfig.host;        
    }.property(),
    
    mushVersion: function() {
        return aresconfig.version;
    }.property(),
    
    portalVersion: function() {
      return aresweb_version;
    }.property(),
    
    currentUser: function() {
        return this.get('session.data.authenticated');
    }.property(),
    
    socketConnected: function() {
      return this.get('gameSocket.connected');
    }.property('gameSocket.connected'),
    
    sidebar: function() {
        return this.get('model');
    }.property('refreshSidebar'),

    topNavbar: function() {
      let config = this.get('model.top_navbar');
      let nav = [];
      let availableRoutes = this.availableRoutes();

      if (!config) {
        return [];
      }
      
      config.forEach(n => {
        let menuOK = true;
        let error = "";
        try {
          n.menu.forEach(m => {
            let route = m.route;
            if (route && !availableRoutes.includes(route)) {
              error = route;
              console.log(`Bad route in menu: ${route}`);
              menuOK = false;
            }
          })
          if (menuOK) {
            nav.push(n); 
          } else {
            nav.push({ title: `MENU ERROR` });
          }
        }
        catch(error) {
          console.log(`Bad menu config under ${n.title}.`);
          nav.push({ title: `MENU ERROR` });
        }
      });
      
      return nav;
      
    }.property('model')
    
});