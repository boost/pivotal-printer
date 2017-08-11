Rails.application.routes.draw do
  root 'pages#home'

  get '/stories/:project_id/:release_id', to: 'pages#stories'

  resources :projects, only: :index do
    resources :releases, only: :index do
      resources :stories, only: :index do
        post 'add_to_print', to: 'stories#add_to_print', as: :add_to_print
        post 'remove_to_print', to: 'stories#remove_to_print', as: :remove_to_print
      end
    end
  end
end
