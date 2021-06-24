class User < ApplicationRecord
  has_secure_password  
  has_and_belongs_to_many :companies
  has_many :invitations

  def generate_password_token!
    self.reset_password_token = generate_token
    self.reset_password_sent_at = Time.now.utc
    save!
  end

  def password_token_valid?
    (self.reset_password_sent_at + 4.hours) > Time.now.utc
  end

  def reset_password!(password)
    self.reset_password_token = nil
    self.password = password
    save!
  end

  def create_invite(invited_user, invited_by, invite_company)
    valid_until = Time.now.utc + 1.week
    @invite = Invitation.create!(user_id: invited_user, invited_by: invited_by, invited_at: Time.now.utc, 
                                invite_valid_until: valid_until, invite_company: invite_company,
                                invite_token: generate_token)
    @invite.set_token
    @invited_user = User.find(invited_user)
    InviteUserMailer.send_invite_email(@invited_user, @invite.invite_token).deliver
  end

  private

  def generate_token
    SecureRandom.hex(10)
  end
end
