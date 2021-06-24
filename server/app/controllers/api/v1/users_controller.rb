module Api::V1
  class UsersController < ApplicationController
    before_action :authorized, only: [:auto_login]

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
        render json: {user: @user.as_json(include: [:companies]), token: token}
      else
        render json: {error: "Invalid email or password"}
      end
    end
  
    # LOGGING IN
    def login
      @user = User.find_by(email: params[:email])
  
      if @user && @user.authenticate(params[:password])
        token = encode_token({user_id: @user.id})
        render json: {user: @user.as_json(include: [:companies]), token: token}
      else
        render json: {error: "Invalid email or password"}, status: :gone 
      end
    end
  
    def auto_login
      render json: {user: @user.as_json(include: [:companies]).except("password_digest"), isAuthenticated: true}
    end
  
    private
  
    def user_params
      params.permit(:full_name, :email, :password, :company_name)
    end
  end
end
