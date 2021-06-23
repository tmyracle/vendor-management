class InviteUserMailer < ApplicationMailer
    default :from => 'hello@useprotocol.com'

    def send_invite_email(user, invite_token)
        @user = user
        @url = "#{Rails.application.credentials.app[:base_url]}/invite/#{invite_token}"
        mail(:to => @user.email, :subject => "Invite to join #{@user.companies[0].name}")
    end
end
