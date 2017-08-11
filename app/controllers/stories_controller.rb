#
# Class PagesController
#
#
class StoriesController < ApplicationController
  def index
    @stories = Rails.cache.fetch("#{params[:release_id]}_stories", expires_in: 3.hours) do
      Story.where(project_id: params[:project_id], release_id: params[:release_id])
    end

    respond_to :html, :js
  end
end
