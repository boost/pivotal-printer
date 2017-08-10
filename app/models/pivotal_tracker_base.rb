#
class PivotalTrackerBase < ActiveResource::Base
  self.site = 'https://www.pivotaltracker.com/services/v5/'
  headers['X-TrackerToken'] = ENV['PIVOTAL_TRACKER_TOKEN']
end
