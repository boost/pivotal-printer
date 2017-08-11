#
class Project < PivotalTrackerBase
  has_many :releases
  has_many :project_stories
end
