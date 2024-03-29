Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :companies, only: [:show, :create, :update]
      resources :vendors
      resources :contacts
      resources :msas
      resources :cois
      resources :w9s
      resources :line_items    
      resource :users, only: [:create, :update]
      post "/login", to: "users#login"
      get "/auto_login", to: "users#auto_login"
      get "/current_user", to: "users#show_current_user"
      post "/password/forgot", to: "passwords#forgot"
      post "/password/reset", to: "passwords#reset"
      post "/invite", to: "invitations#invite"
      post "/invite/accept", to: "invitations#accept"
      post "/presigned_url", to: "direct_upload#create"
      get "/vendor_list", to: "vendors#vendor_list"
      get "/dashboard", to: "dashboard#show"
    end
  end

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end