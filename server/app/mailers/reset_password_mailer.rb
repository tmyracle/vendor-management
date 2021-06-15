class ResetPasswordMailer < ApplicationMailer
  default :from => 'hello@useprotocol.com'

  def send_password_reset_email(user)
    # TODO: Build out mailer with link and token
    @user = user
    mail(:to => @user.email, :subject => "Reset your password")
  end
end
