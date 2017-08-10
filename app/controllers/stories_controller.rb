#
# Class PagesController
#
#
class StoriesController < ApplicationController
  def index
    @stories = Story.where(project_id: params[:project_id], release_id: params[:release_id])
  end
end
