"use client";

import { Facebook, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, Download, Briefcase, Users, Award, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const companyLinks = [
  { href: "/about", label: "About Us", icon: Users },
  { href: "/careers", label: "Careers", icon: Briefcase },
  { href: "/employers", label: "For Employers", icon: Award },
  { href: "/press", label: "Press & Media", icon: Mail },
  { href: "/blog", label: "Blog", icon: Mail },
];

const supportLinks = [
  { href: "/help", label: "Help Center", icon: Shield },
  { href: "/contact", label: "Contact Us", icon: Phone },
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/terms", label: "Terms of Service", icon: Shield },
  { href: "/sitemap", label: "Sitemap", icon: MapPin },
];

const jobCategories = [
  { href: "/jobs/technology", label: "Technology Jobs" },
  { href: "/jobs/marketing", label: "Marketing Jobs" },
  { href: "/jobs/finance", label: "Finance Jobs" },
  { href: "/jobs/healthcare", label: "Healthcare Jobs" },
  { href: "/jobs/education", label: "Education Jobs" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/worknow", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/worknow", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/worknow", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/worknow", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src="/img/logo.png"
                    alt="WorkNow Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <span className="-ml-6 mt-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  WorkNow
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                Connect with your dream career. Join millions of professionals finding opportunities that matter.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="h-4 w-4 text-purple-400" />
                <span>hello@worknow.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="h-4 w-4 text-purple-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link 
                    key={social.label} 
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-br hover:from-purple-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  >
                    <social.icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors duration-200 text-sm group"
                  >
                    <link.icon className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors duration-200 text-sm group"
                  >
                    <link.icon className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Job Categories */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-slate-200 mb-3">Popular Categories</h4>
              <ul className="space-y-2">
                {jobCategories.slice(0, 3).map((category) => (
                  <li key={category.label}>
                    <Link 
                      href={category.href}
                      className="text-xs text-slate-400 hover:text-purple-400 transition-colors duration-200"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* App Download Card */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border-purple-500/20 backdrop-blur-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Download className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">Get the App</CardTitle>
                </div>
                
                <CardDescription className="text-slate-300 text-sm leading-relaxed">
                  Access thousands of jobs on the go with our mobile app. Get instant notifications for new opportunities.
                </CardDescription>
                
                <div className="space-y-2">
                  <Button 
                    asChild 
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-medium"
                  >
                    <Link href="#" className="flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download App
                    </Link>
                  </Button>
                  <p className="text-xs text-slate-400 text-center">
                    Available on iOS & Android
                  </p>
                </div>
              </div>
            </Card>

            {/* Newsletter Signup */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <div className="p-6 space-y-4">
                <h4 className="text-white font-semibold">Stay Updated</h4>
                <p className="text-slate-300 text-sm">
                  Get weekly job alerts and career tips.
                </p>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <Link href="/newsletter">
                    Subscribe Newsletter
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
              <p>&copy; 2024 WorkNow Inc. All rights reserved.</p>
              <div className="hidden md:block w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-purple-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Made with</span>
              <span className="text-red-400">❤️</span>
              <span>for job seekers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};