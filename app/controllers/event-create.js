import Controller from '@ember/controller';
import AuthenticatedController from 'ares-webportal/mixins/authenticated-controller';
import dayjs from 'dayjs';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend(AuthenticatedController, {
    gameApi: service(),
    flashMessages: service(),
    router: service(),
    title: '',
    date: '',
    time: '',
    description: '',
    tags: '',
    content_warning: '',
    organizer: null,
    warning_tags: [],
    
    resetOnExit: function() {
        this.set('title', '');
        this.set('date', '');
        this.set('time', '');
        this.set('tags', '');
        this.set('organizer', null);
        this.set('description', '');
        this.set('content_warning', '');
        this.set('warning_tags', []);
    },
    
    @action
    changeDate(date) {
       this.set('date', date);
    },
    
    actions: {
      organizerChanged(org) {
        this.set('organizer', org);
      },
      
        
        create: function() {
            let api = this.gameApi;
            
            let tags = this.tags || [];
            if (!Array.isArray(tags)) {
                tags = tags.split(/[\s,]/);
            }
            
            let formattedDate = dayjs(this.date).format(this.get('model.app.game.date_entry_format'));                        
            api.requestOne('createEvent', { title: this.title, 
               date: formattedDate,
               time: this.time,
               content_warning: this.content_warning,
               organizer: this.organizer ? this.organizer.name : "",
               tags: tags,
               description: this.description }, null)
            .then( (response) => {
                if (response.error) {
                    return;
                }
                this.router.transitionTo('event',                          
                          response.id);
                this.flashMessages.success('Event added!');
            });
        },
        
        warningsChanged(new_warnings) {
          this.set('warning_tags', new_warnings);
          this.set('content_warning', new_warnings.join(', '));
        },
    }
});