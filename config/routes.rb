Rails.application.routes.draw do
  root 'pages#home'

  get '/stories/:project_id/:release_id', to: 'pages#stories'

  resources :projects, only: :index do
    resources :releases, only: :index do
      resources :stories, only: :index
    end
  end
end
