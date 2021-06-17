class ResetPasswordMailer < ApplicationMailer
  default :from => 'hello@useprotocol.com'

  def send_password_reset_email(user)
    # TODO: Build out mailer with link and token
    @user = user
    @url = "http://localhost:3000/reset_password/#{@user.reset_password_token}"
    mail(:to => @user.email, :subject => "Reset your password")
  end
end
