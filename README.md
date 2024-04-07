# PriorityLens

**Team Members:** Azeem Ehtisham, Riley Carter, Connor Brinkman, Alex Chinn

**Explore on GitHub!** [GitHub Repository Link]

## Inspiration
In an era where security demands precision, traditional surveillance systems often blanket areas without differentiating the importance of the objects around them or effectively maximizing coverage with limited resources. PriorityLens emerges from the necessity for a smarter approach, focusing on dynamically prioritizing areas of interest with the ultimate goal of maximizing the coverage of a space using a limited number of cameras. This innovative solution addresses the core challenge of strategic surveillance—ensuring that critical areas are monitored closely, while optimizing the use of resources to cover as much area as possible.


## Inspiration
Today's security cameras are everywhere, but they don't always focus on the most important areas. PriorityLens was made to fix that. We wanted to make sure cameras cover important spaces as much as possible, even when there aren't many cameras to use. Our goal is to help keep an eye on the places that matter most, using smart planning to make every camera count.


## What It Does

PriorityLens is a proof of concept website that when given a top down view of a building, can decide the optimal location to place security cameras, also taking the importance of objects on the property like cars into account. 




## How We Built It
PriorityLens enhances security monitoring by strategically placing surveillance cameras to cover essential areas with precision. It utilizes a unique weighting system that assigns values to various objects, creating weighted priority points within predefined sectors. These points ensure critical zones receive focused monitoring, thereby improving surveillance efficiency and adaptability.

Central to our design is the innovative use of the fields of view from two cameras to establish bounded areas. This approach ensures comprehensive surveillance coverage within these regions, effectively making it impossible for anyone to traverse undetected. Moreover, PriorityLens prioritizes the placement of these weighted priority points within the bounded areas, maximizing the coverage of important zones. This ensures that high-priority areas are not only surveilled but also secured within the overlap of camera views for enhanced protection.

Built upon a foundation of spatial analytics and advanced algorithms, PriorityLens calculates optimal camera positions to effectively encompass high-priority zones. This dynamic system is designed for real-time responsiveness, adapting to changing security requirements and providing strategic coverage tailored to each unique environment.




## Challenges We Ran Into
Navigating the complexities of trigonometry to maximize the coverage area posed a significant challenge, requiring over 600 lines of algebra and about 25 hours to transition from conceptual logic to algebraic implementation. Moreover, our journey to define and implement the concept of priority zones was marked by a series of evolving ideas that tested our adaptability and creativity. Initially, we aimed to simply maximize the coverage of important spaces. This approach, however, soon evolved into experimenting with rays to designate priority—conceiving a system where rays touching an area would assign it importance. Despite the promise of these methods, we encountered limitations that led us to a more refined strategy: assigning weights to individual objects and calculating their weighted average within specific sectors of the map. This final approach demanded a deep dive into both spatial analysis and the strategic balancing of resource allocation, ultimately guiding us to a solution that harmoniously blends coverage efficiency with the nuanced prioritization of space.

## Accomplishments We're Proud Of
Beyond overcoming the mathematical and strategic hurdles, one of our most significant achievements lies in the integration of artificial intelligence to intuitively assign importance values to objects within surveillance zones. We trained an AI model to evaluate the significance of various objects, outputting a numerical importance rating on a scale from 1 to 4. This innovative approach not only streamlined the process of designating priority levels to different areas but also introduced a level of automation and scalability that is crucial for large-scale applications. In practice, this allows users to simply input the type of object they're assessing, and the AI automatically assigns it a weighted value based on its assessed importance. This milestone not only showcases our technical prowess but also marks a pivotal step towards realizing a user-friendly, intelligent surveillance optimization tool that adapts to diverse needs and environments.


## What's Next for PriorityLens
- **Advanced Mapping Integration:** Envisioning a future where users can select any location directly within the application, PriorityLens is set to integrate with mapping software like Google Maps. This allows for an intuitive mapping experience, leveraging comprehensive geographical data for precise, context-aware surveillance planning.
  
- **Dynamic Object Priority Database:** Developing a dynamic database to catalogue objects and their corresponding priority values, enhancing the system's knowledge base for better decision-making in camera placements.
  
- **AI-Driven Priority Assignment:** Implementing an AI trained on LLAMA2 to intelligently assign importance values to newly encountered objects, storing these values in the database for future reference and continuously enriching the system's understanding of object significance.
  
- **User-Friendly Mobile Application:** The goal is to make PriorityLens accessible on-the-go, transforming it into a mobile application where users can easily map out camera placements right from their smartphones, further democratizing sophisticated surveillance optimization.
