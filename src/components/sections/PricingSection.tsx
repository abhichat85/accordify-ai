
import React from "react";

// Pricing section component
export const PricingSection = () => {
  return (
    <div className="p-6 h-full overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Pricing & Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Free Plan */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6">
            <h3 className="text-xl font-bold">Free</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">50 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Basic document creation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Standard templates (5)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Email support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">5 team members</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors">
              Current Plan
            </button>
          </div>
        </div>
        
        {/* Pro Alpha Plan */}
        <div className="bg-card rounded-xl border border-primary/30 overflow-hidden hover:shadow-lg transition-all relative">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
            Popular
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro Alpha</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$20</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">300 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Advanced document creation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Premium templates (20)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Unlimited team members</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Upgrade to Pro Alpha
            </button>
          </div>
        </div>
        
        {/* Pro Beta Plan */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro Beta</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$50</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">700 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Everything in Pro Alpha</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Advanced workflow automation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Custom integrations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Dedicated support</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Upgrade to Pro Beta
            </button>
          </div>
        </div>
        
        {/* Pro Gamma Plan */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro Gamma</h3>
            <div className="mt-2 flex items-end">
              <span className="text-3xl font-bold">$100</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">1300 credits included</p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Everything in Pro Beta</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Enterprise-grade security</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Custom development support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">SLA guarantees</span>
              </li>
            </ul>
          </div>
          <div className="p-6 bg-muted/20">
            <button className="w-full py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
              Upgrade to Pro Gamma
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-xl font-semibold mb-4">Credit Usage</h2>
        <div className="h-64 mb-6">
          {/* This is a placeholder for the chart - in a real app, use recharts or another charting library */}
          <div className="w-full h-full bg-muted/20 rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Credit usage chart</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Credits Used</h3>
            <p className="text-3xl font-bold">210</p>
          </div>
          <div className="bg-muted/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Credits Remaining</h3>
            <p className="text-3xl font-bold">90</p>
          </div>
        </div>
      </div>
    </div>
  );
};
