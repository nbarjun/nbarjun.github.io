# -*- encoding: utf-8 -*-
# stub: commonmarker 0.23.6 ruby lib ext
# stub: ext/commonmarker/extconf.rb

Gem::Specification.new do |s|
  s.name = "commonmarker".freeze
  s.version = "0.23.6"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "rubygems_mfa_required" => "true" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze, "ext".freeze]
  s.authors = ["Garen Torikian".freeze, "Ashe Connor".freeze]
  s.date = "2022-09-21"
  s.description = "A fast, safe, extensible parser for CommonMark. This wraps the official libcmark library.".freeze
  s.executables = ["commonmarker".freeze]
  s.extensions = ["ext/commonmarker/extconf.rb".freeze]
  s.files = ["bin/commonmarker".freeze, "ext/commonmarker/extconf.rb".freeze]
  s.homepage = "https://github.com/gjtorikian/commonmarker".freeze
  s.licenses = ["MIT".freeze]
  s.rdoc_options = ["-x".freeze, "ext/commonmarker/cmark/.*".freeze]
  s.required_ruby_version = Gem::Requirement.new([">= 2.6".freeze, "< 4.0".freeze])
  s.rubygems_version = "3.3.19".freeze
  s.summary = "CommonMark parser and renderer. Written in C, wrapped in Ruby.".freeze

  s.installed_by_version = "3.3.19" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<awesome_print>.freeze, [">= 0"])
    s.add_development_dependency(%q<json>.freeze, ["~> 2.3"])
    s.add_development_dependency(%q<minitest>.freeze, ["~> 5.6"])
    s.add_development_dependency(%q<minitest-focus>.freeze, ["~> 1.1"])
    s.add_development_dependency(%q<rake>.freeze, [">= 0"])
    s.add_development_dependency(%q<rake-compiler>.freeze, ["~> 0.9"])
    s.add_development_dependency(%q<rdoc>.freeze, ["~> 6.2"])
    s.add_development_dependency(%q<rubocop>.freeze, [">= 0"])
    s.add_development_dependency(%q<rubocop-standard>.freeze, [">= 0"])
  else
    s.add_dependency(%q<awesome_print>.freeze, [">= 0"])
    s.add_dependency(%q<json>.freeze, ["~> 2.3"])
    s.add_dependency(%q<minitest>.freeze, ["~> 5.6"])
    s.add_dependency(%q<minitest-focus>.freeze, ["~> 1.1"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<rake-compiler>.freeze, ["~> 0.9"])
    s.add_dependency(%q<rdoc>.freeze, ["~> 6.2"])
    s.add_dependency(%q<rubocop>.freeze, [">= 0"])
    s.add_dependency(%q<rubocop-standard>.freeze, [">= 0"])
  end
end
