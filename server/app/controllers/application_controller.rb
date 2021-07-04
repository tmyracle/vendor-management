class ApplicationController < ActionController::API
  before_action :authorized

  def fallback_index_html
    render :file => 'public/index.html'
  end

  def encode_token(payload)
    JWT.encode(payload, Rails.application.credentials.jwt[:secret_token])
  end

  def auth_header
    # { Authorization: 'Bearer <token>' }
    request.headers['Authorization']
  end

  def decoded_token
    if auth_header
      token = auth_header.split(' ')[1]
      # header: { 'Authorization': 'Bearer <token>' }
      begin
        JWT.decode(token, Rails.application.credentials.jwt[:secret_token], true, algorithm: 'HS256')
      rescue JWT::DecodeError
        nil
      end
    end
  end

  def logged_in_user
    if decoded_token
      user_id = decoded_token[0]['user_id']
      @user = User.find_by(id: user_id)
    end
  end

  def logged_in?
    !!logged_in_user
  end

  def authorized
    render json: { isAuthenticated: false, message: 'Please log in' }, status: :unauthorized unless logged_in?
  end
end
