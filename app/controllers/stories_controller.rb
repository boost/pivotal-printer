#
# Class PagesController
#
#
class StoriesController < ApplicationController
  def index
    @stories = Rails.cache.fetch("#{params[:release_id]}_stories", expires_in: 3.hours) do
      Story.where(project_id: params[:project_id], release_id: params[:release_id])
    end

    respond_to do |format|
      format.html
      format.js
      format.json { render :json => Story.where(project_id: params[:project_id], release_id: params[:release_id]).to_json }
    end
  end

  def add_to_print
    project_id = params[:project_id]

    session[:stories] ||= {}
    session[:stories][project_id] ||= []
    session[:stories][project_id] << story_id_key unless session[:stories][project_id].include?(story_id_key)

    set_stories_to_print

    respond_to :js
  end

  def remove_to_print
    project_id = params[:project_id]

    session[:stories] ||= {}
    session[:stories][project_id] ||= []
    session[:stories][project_id].delete(story_id_key)

    set_stories_to_print

    respond_to :js
  end

  private

  def story_id_key
    "id:#{params[:story_id]}"
  end
end
