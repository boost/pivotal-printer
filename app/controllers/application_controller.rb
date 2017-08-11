#
# Class ApplicationController
#
#
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def set_stories_to_print
    project_id = params[:project_id]

    session[:stories] ||= {}
    session[:stories][project_id] ||= []

    filter_query = session[:stories][project_id].join(' OR ')
    filter_query = 'id:0' unless filter_query.present?

    @stories_to_print = ProjectStory.find(:all, params: { filter: filter_query, project_id: params[:project_id] })
  end
end
