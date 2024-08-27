
//
// CdrColor.m
//

#import "CdrColor.h"

@implementation CdrColor

+ (UIColor *)color:(CdrColorName)colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.750f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.750f],
[UIColor colorWithRed:0.259f green:0.231f blue:0.184f alpha:0.750f],
[UIColor colorWithRed:0.012f green:0.012f blue:0.004f alpha:0.900f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.180f green:0.420f blue:0.204f alpha:1.000f],
[UIColor colorWithRed:0.522f green:0.278f blue:0.078f alpha:1.000f],
[UIColor colorWithRed:0.506f green:0.094f blue:0.137f alpha:1.000f],
[UIColor colorWithRed:0.106f green:0.263f blue:0.494f alpha:1.000f],
[UIColor colorWithRed:0.733f green:0.251f blue:0.271f alpha:1.000f],
[UIColor colorWithRed:0.125f green:0.125f blue:0.114f alpha:1.000f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.750f],
[UIColor colorWithRed:0.698f green:0.671f blue:0.624f alpha:1.000f],
[UIColor colorWithRed:0.259f green:0.231f blue:0.184f alpha:0.750f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.750f],
[UIColor colorWithRed:0.259f green:0.231f blue:0.184f alpha:0.750f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.125f green:0.125f blue:0.114f alpha:1.000f],
[UIColor colorWithRed:0.259f green:0.231f blue:0.184f alpha:0.750f],
[UIColor colorWithRed:0.702f green:0.200f blue:0.133f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.043f green:0.176f blue:0.376f alpha:1.000f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.750f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.698f green:0.671f blue:0.624f alpha:1.000f],
[UIColor colorWithRed:0.259f green:0.231f blue:0.184f alpha:0.750f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.750f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.000f blue:0.000f alpha:0.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.910f green:0.878f blue:0.808f alpha:1.000f],
[UIColor colorWithRed:0.925f green:0.976f blue:0.902f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.984f blue:0.961f alpha:1.000f],
[UIColor colorWithRed:0.835f green:0.902f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.992f green:0.965f blue:0.886f alpha:1.000f],
[UIColor colorWithRed:0.996f green:0.988f blue:0.945f alpha:1.000f],
[UIColor colorWithRed:0.961f green:0.914f blue:0.718f alpha:1.000f],
[UIColor colorWithRed:0.988f green:0.937f blue:0.910f alpha:1.000f],
[UIColor colorWithRed:0.992f green:0.969f blue:0.969f alpha:1.000f],
[UIColor colorWithRed:0.933f green:0.796f blue:0.757f alpha:1.000f],
[UIColor colorWithRed:0.886f green:0.957f blue:0.996f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.957f blue:0.961f alpha:1.000f],
[UIColor colorWithRed:0.761f green:0.847f blue:0.859f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:0.850f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:0.750f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:0.750f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:0.150f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:0.850f],
[UIColor colorWithRed:1.000f green:0.949f blue:0.949f alpha:0.750f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.824f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.216f green:0.216f blue:0.204f alpha:1.000f],
[UIColor colorWithRed:0.216f green:0.216f blue:0.204f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.216f green:0.216f blue:0.204f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.122f green:0.318f blue:0.247f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.929f green:0.918f blue:0.890f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.780f green:0.216f blue:0.059f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.447f green:0.427f blue:0.392f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.000f blue:0.000f alpha:0.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.231f green:0.514f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.714f green:0.545f blue:0.216f alpha:1.000f],
[UIColor colorWithRed:0.733f green:0.251f blue:0.271f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.447f green:0.427f blue:0.392f alpha:1.000f],
[UIColor colorWithRed:0.910f green:0.878f blue:0.808f alpha:1.000f],
[UIColor colorWithRed:0.231f green:0.514f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.835f green:0.902f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.714f green:0.545f blue:0.216f alpha:1.000f],
[UIColor colorWithRed:0.961f green:0.914f blue:0.718f alpha:1.000f],
[UIColor colorWithRed:0.733f green:0.251f blue:0.271f alpha:1.000f],
[UIColor colorWithRed:0.933f green:0.796f blue:0.757f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.557f blue:0.525f alpha:1.000f],
[UIColor colorWithRed:0.761f green:0.847f blue:0.859f alpha:1.000f],
[UIColor colorWithRed:0.125f green:0.125f blue:0.114f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.702f green:0.200f blue:0.133f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.125f green:0.125f blue:0.114f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.125f green:0.125f blue:0.114f alpha:1.000f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.043f green:0.176f blue:0.376f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.741f green:0.482f blue:0.176f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.471f green:0.694f blue:0.910f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.471f green:0.694f blue:0.910f alpha:1.000f],
[UIColor colorWithRed:0.820f green:0.796f blue:0.741f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.976f green:0.973f blue:0.965f alpha:1.000f],
[UIColor colorWithRed:0.573f green:0.545f blue:0.502f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.431f blue:0.710f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.447f green:0.427f blue:0.392f alpha:1.000f],
[UIColor colorWithRed:0.231f green:0.514f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.714f green:0.545f blue:0.216f alpha:1.000f],
[UIColor colorWithRed:0.733f green:0.251f blue:0.271f alpha:1.000f],
[UIColor colorWithRed:0.251f green:0.557f blue:0.525f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.306f green:0.302f blue:0.286f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:0.863f green:0.839f blue:0.796f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.957f green:0.949f blue:0.929f alpha:1.000f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.200f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.200f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.200f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.200f],
[UIColor colorWithRed:0.047f green:0.043f blue:0.031f alpha:0.200f]
    ];
  });

  return colorArray;
}

@end