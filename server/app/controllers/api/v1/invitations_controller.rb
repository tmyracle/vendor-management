module Api::V1
  class InvitationsController < ApplicationController 
    before_action :authorized, except: [:accept]

    def invite 
      company = Company.find(@user.companies.first.id)
      @invited_user = User.create!(full_name: params[:full_name], email: params[:email], password: SecureRandom.hex(10))
      @invited_user.companies << company
      @invited_user.create_invite(@invited_user.id, @user.id, company.id)
      render json: {invited_user: @invited_user.as_json(include: [:companies]).except("password_digest")}
    end

    def accept
      if params[:token].blank?
        return render json: {error: 'Token not present'}
      end

      token = params[:token].to_s
      invite = Invitation.find_by(invite_token: token)
      user = invite.user

      if user.present? && invite.invite_token_valid
        if user.reset_password!(params[:password])
          invite.invite_accepted_at = Time.now.utc
          invite.save!
          render json: {status: 'ok'}, status: :ok
        else
          render json: {error: user.errors.full_messages}, status: :unprocessable_entity
        end
      else
        render json: {error:  ['Link not valid or expired. Try generating a new link.']}, status: :not_found
      end
    end


    private

    def invite_params
      params.permit(:full_name, :email)
    end

  end
end
