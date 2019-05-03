class DataController < ApplicationController
  def index
    respond_to do |format|
      format.json { render :json => Story.where(project_id: params[:project_id]).to_json }
    end
  end
end
