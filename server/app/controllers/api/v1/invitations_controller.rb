module Api::V1
  class InvitationsController < ApplicationController 
    before_action :authorized

    def invite 
      company = Company.find(@user.companies.first.id)
      @invited_user = User.create!(full_name: params[:full_name], email: params[:email], password: SecureRandom.hex(10))
      @invited_user.companies << company
      render json: {invited_user: @invited_user.as_json(include: [:companies]).except("password_digest")}
    end

    private

    def invite_params
      params.permit(:full_name, :email)
    end

  end
end
