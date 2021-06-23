class Invitation < ApplicationRecord
  belongs_to :user

  def set_token
    generate_invite_token
    save!
  end

  def invite_token_valid
    return Time.now.utc < self.invite_valid_until
  end

  private

  def generate_invite_token
    SecureRandom.hex(10)
  end

end
