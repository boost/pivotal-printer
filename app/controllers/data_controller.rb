class DataController < ApplicationController
  def index
    client = TrackerApi::Client.new(token: 'a8104e0f2cbcedd33f00ff4f94105df6')
    project  = client.project(params[:project_id].to_i)
    story = project.story(params[:story_id].to_i)

    render :json { story: story }
  end
end
