module Api::V1
  class UsersController < ApplicationController
    before_action :authorized, only: [:auto_login, :update, :show_current_user]

    # REGISTER
    def create
      @user = User.create(user_params.except(:company_name))

      if user_params.has_key?(:company_name)
        @company = Company.create(name: user_params[:company_name])
        @user.companies << @company
      end

      if @user.valid?
        token = encode_token({user_id: @user.id})
        UserNotifierMailer.send_signup_email(@user).deliver
        render json: {user: @user.as_json(include: [:companies]), token: token}, status: :ok
      else
        render json: {error: "Invalid email or password"}, status: :internal_server_error
      end
    end

    def show_current_user
      if @user.present?
        render json: @user, status: :ok
      else
        render json: {message: "Error encountered."}, status: :internal_server_error
      end
    end

    def update
      if params[:new_password].present?
        @user.reset_password!(params[:new_password])
      end

      if params[:full_name]
        @user.update(update_params)
        render json: @user, status: :ok
      end
    end
  
    # LOGGING IN
    def login
      @user = User.find_by(email: params[:email])
  
      if @user && @user.authenticate(params[:password])
        token = encode_token({user_id: @user.id})
        render json: {user: @user.as_json(include: [:companies]), token: token}, status: :ok
      else
        render json: {message: "Invalid email or password"}, status: :unauthorized
      end
    end
  
    def auto_login
      render json: {user: UserSerializer.new(@user), isAuthenticated: true}
    end
  
    private
  
    def user_params
      params.permit(:full_name, :email, :password, :company_name)
    end

    def update_params
      params.permit(:full_name, companies_attributes: [:id, :name, :logo, :new_password]).select { |k,v| !v.nil? }
    end

  end
end
